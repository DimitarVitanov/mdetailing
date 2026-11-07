// The home page's drive-in, rendered offline into a video by render.mjs (the website itself
// never runs this: it plays the result, public/video/drive-*.mp4).
//
// A night road with lane markings and LED rails. The car's headlights show far away; it drives
// in from the left lane to the middle, brakes with a nose dip, the studio lights flicker on, and
// an inspection light sweeps left to right leaving the paint glossy behind it while the camera
// pushes in.
//
// window.setup({ width, height, fov, fill: [w, h] }) → loads and frames the scene
// window.renderAt(seconds)                          → renders that moment
//
// Model: Ferrari 458 Italia by vicent091036 (Sketchfab, CC BY 4.0), from the three.js examples.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const INK = new THREE.Color(0x07080a);
const LED = new THREE.Color(0xbfe9ff);

// Timeline (seconds)
export const T = { brakeAt: 2.8, stop: 3.8, lightsOn: 3.9, sweepFrom: 4.35, sweepTo: 5.55, end: 6.4 };
const DIST = 95; // how far away the car starts (m)
const START_X = -2.1; // the left lane, seen from the camera

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };
const easeInOut = (t) => { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

function seeded(seed) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

let renderer, composer, scene, camera, car, curve;
let wheels = [];
let wheelBase = [];
let sweepUniform = { value: -10 };
let headSpots = [], headSprites = [];
let key, hemi, inspect;
let cfg;
let lookY = 0.55;

// Distance driven: constant speed, then a linear brake to a stop at T.stop.
function driven(t) {
    const tb = T.brakeAt, ts = T.stop;
    const v0 = DIST / (tb + (ts - tb) / 2);
    if (t <= 0) return 0;
    if (t < tb) return v0 * t;
    if (t < ts) {
        const u = t - tb;
        return v0 * tb + v0 * u - 0.5 * (v0 / (ts - tb)) * u * u;
    }
    return DIST;
}

function pitch(t) {
    if (t < T.brakeAt) return 0;
    if (t < T.stop) return 0.024 * smooth((t - T.brakeAt) / 0.35);
    const u = t - T.stop;
    return 0.024 * Math.exp(-u * 4.5) * Math.cos(u * 10);
}

// The studio lights coming on: a few flickers, then steady.
function lightsOn(t) {
    const u = t - T.lightsOn;
    if (u < 0) return 0;
    const steps = [[0, 1], [0.06, 0.12], [0.12, 1], [0.2, 0.35], [0.28, 1], [0.34, 0.6], [0.42, 1]];
    let v = 0;
    for (const [at, val] of steps) if (u >= at) v = val;
    return v;
}

function roadTexture() {
    // 10 m across × 40 m along, repeated down the road.
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 2048;
    const g = c.getContext('2d');
    g.fillStyle = '#0c0e11';
    g.fillRect(0, 0, c.width, c.height);
    const rnd = seeded(7);
    const img = g.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < img.data.length; i += 4) {
        const n = (rnd() * 14) | 0;
        img.data[i] += n;
        img.data[i + 1] += n;
        img.data[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
    const px = c.width / 10;
    g.fillStyle = 'rgba(232, 236, 240, 0.9)';
    for (const x of [-4.2, 4.2]) g.fillRect((x + 5) * px - 0.08 * px, 0, 0.16 * px, c.height); // edge lines
    for (let z = 0; z < 40; z += 10) g.fillRect(5 * px - 0.07 * px, z * px, 0.14 * px, 4 * px); // dashed centre line
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 260 / 40);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
}

// What the paint reflects: a black studio with a few long light strips, so the clean paint shows
// crisp lines instead of a grey room.
function studioEnvironment() {
    const env = new THREE.Scene();
    const room = new THREE.Mesh(new THREE.BoxGeometry(40, 14, 40), new THREE.MeshBasicMaterial({ color: 0x030405, side: THREE.BackSide }));
    room.position.y = 6;
    env.add(room);
    const strip = (w, h, x, y, z, ry, rx, power, tint = 0xffffff) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(power), side: THREE.DoubleSide }));
        m.position.set(x, y, z);
        m.rotation.set(rx, ry, 0, 'YXZ');
        env.add(m);
    };
    for (const x of [-1.3, 1.3]) strip(0.5, 12, x, 5, 0, 0, Math.PI / 2, 5); // overhead strips, along the car
    strip(4, 7, 0, 7, 0, 0, Math.PI / 2, 1.2); // soft box above
    for (const x of [-9, 9]) strip(16, 0.35, x, 1.4, 0, Math.PI / 2, 0, 5, 0xdff2ff); // side lines
    strip(8, 2.2, 0, 2.4, 12, 0, 0, 1.6); // behind the camera
    strip(10, 1.2, 0, 1.6, -12, 0, 0, 0.9, 0xbfe9ff); // far end
    return env;
}

function glowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.18, 'rgba(235,246,255,0.85)');
    r.addColorStop(0.5, 'rgba(191,233,255,0.18)');
    r.addColorStop(1, 'rgba(191,233,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

// The paint: dull and dusty until the inspection light has passed (world x < uSweep), then
// showroom gloss. A per-pixel blend, so the clean area follows the light across the car.
function paintMaterial() {
    const m = new THREE.MeshPhysicalMaterial({ color: 0xb80d18, metalness: 0.6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.02 });
    m.onBeforeCompile = (shader) => {
        shader.uniforms.uSweep = sweepUniform;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
            .replace('#include <project_vertex>', '#include <project_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform float uSweep;\nvarying vec3 vWorldPos;\nfloat cleanAmt;')
            .replace('#include <color_fragment>', `#include <color_fragment>
                cleanAmt = smoothstep(uSweep + 0.35, uSweep - 0.35, vWorldPos.x);
                vec3 dusty = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11))), 0.5) * 0.42;
                diffuseColor.rgb = mix(dusty, diffuseColor.rgb, cleanAmt);`)
            .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(0.78, roughnessFactor, cleanAmt);')
            .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(0.1, metalnessFactor, cleanAmt);')
            .replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\nmaterial.clearcoat *= cleanAmt;');
    };
    return m;
}

window.setup = async (options) => {
    cfg = options;
    const scale = cfg.scale ?? 1.5; // rendered larger, downscaled by ffmpeg: smooth edges
    const w = Math.round(cfg.width * scale);
    const h = Math.round(cfg.height * scale);

    renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    RectAreaLightUniformsLib.init();

    scene = new THREE.Scene();
    scene.background = INK;
    scene.fog = new THREE.FogExp2(INK, 0.03);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(studioEnvironment(), 0.02).texture;
    scene.environmentIntensity = 0.2;

    camera = new THREE.PerspectiveCamera(cfg.fov, w / h, 0.3, 400);

    // ── the road ──
    const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 260), new THREE.MeshStandardMaterial({ map: roadTexture(), roughness: 0.86, metalness: 0.05, envMapIntensity: 0.15 }));
    road.rotation.x = -Math.PI / 2;
    road.position.z = 20 - 130;
    road.receiveShadow = true;
    scene.add(road);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 1, envMapIntensity: 0 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    // LED rails along both edges, and small LED posts every 10 m
    const railMat = new THREE.MeshBasicMaterial({ color: LED.clone().multiplyScalar(3.2) });
    for (const x of [-5.3, 5.3]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 260), railMat);
        rail.position.set(x, 0.03, -110);
        scene.add(rail);
    }
    const postMat = new THREE.MeshBasicMaterial({ color: LED.clone().multiplyScalar(2.2) });
    const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.7, 0.05), postMat, 2 * 22);
    const m4 = new THREE.Matrix4();
    let n = 0;
    for (let z = 10; z > -210; z -= 10) {
        for (const x of [-5.7, 5.7]) posts.setMatrixAt(n++, m4.makeTranslation(x, 0.35, z));
    }
    scene.add(posts);

    // ── light ──
    hemi = new THREE.HemisphereLight(0x6f8aa3, 0x050507, 0.25);
    scene.add(hemi);
    const moon = new THREE.DirectionalLight(LED, 0.7);
    moon.position.set(-6, 6, -10);
    scene.add(moon);
    // the key light: a spot straight over the parking place, so the car stands in a pool of
    // light and the road around it stays dark
    key = new THREE.SpotLight(0xffffff, 0, 0, 0.34, 0.75, 0);
    key.position.set(1.2, 10, 1.5);
    key.target.position.set(0, 0, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { near: 4, far: 16 });
    key.shadow.bias = -0.0002;
    scene.add(key, key.target);
    // the inspection light: a long bar that sweeps across the car
    inspect = new THREE.RectAreaLight(0xeaf6ff, 0, 0.18, 4.6);
    inspect.position.set(-3.2, 2.1, 0);
    inspect.up.set(0, 0, 1);
    inspect.lookAt(-3.2, 0, 0);
    scene.add(inspect);

    // ── the car ──
    const draco = new DRACOLoader();
    draco.setDecoderPath('/three/examples/jsm/libs/draco/gltf/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    const gltf = await loader.loadAsync('/tool/ferrari.glb');
    const model = gltf.scene.children[0];
    model.rotation.y = Math.PI; // the model's nose points to -z; turned round it faces the camera
    model.getObjectByName('body').material = paintMaterial();
    const chrome = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.35 });
    for (const name of ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim']) model.getObjectByName(name).material = chrome;
    model.getObjectByName('glass').material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1 });
    for (const name of ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']) {
        const w = model.getObjectByName(name);
        wheels.push(w);
        wheelBase.push(w.rotation.x);
    }
    model.traverse((o) => { if (o.isMesh) o.castShadow = true; });

    // contact shadow, lifted off the road so the two never fight for depth
    const ao = await new THREE.TextureLoader().loadAsync('/tool/ferrari_ao.png');
    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
        new THREE.MeshBasicMaterial({ map: ao, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true, premultipliedAlpha: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.004;
    shadow.renderOrder = 2;
    model.add(shadow);

    car = new THREE.Group();
    car.rotation.order = 'YXZ';
    car.add(model);
    scene.add(car);

    // headlights: spots that light the road ahead, and glows that read from far away
    car.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    lookY = box.min.y + (box.max.y - box.min.y) * 0.42;
    // the headlamps: the outer ends of the model's front light mesh
    const lampBox = new THREE.Box3().setFromObject(model.getObjectByName('lights'));
    const lamps = new THREE.Vector3(lampBox.max.x - 0.04, (lampBox.min.y + lampBox.max.y) / 2, lampBox.max.z);
    const glow = glowTexture();
    for (const side of [-1, 1]) {
        const at = new THREE.Vector3(side * lamps.x, lamps.y, lamps.z);
        const spot = new THREE.SpotLight(0xeaf6ff, 40, 0, 0.42, 0.55, 2);
        spot.position.copy(at);
        spot.target.position.set(at.x * 1.4, 0, at.z + 14);
        car.add(spot, spot.target);
        headSpots.push(spot);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color(1, 1, 1).multiplyScalar(6), blending: THREE.AdditiveBlending, depthWrite: false, fog: false, transparent: true }));
        sprite.position.copy(at).add(new THREE.Vector3(0, 0, 0.16));
        car.add(sprite);
        headSprites.push(sprite);
    }

    // ── framing: find the distance at which the parked car fills cfg.fill of the frame ──
    const L = new THREE.Vector3(0, lookY, 0);
    const corners = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
    const fits = (dir, d) => {
        camera.position.copy(L).addScaledVector(dir, d);
        camera.lookAt(L);
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();
        let x0 = 1, x1 = -1, y0 = 1, y1 = -1;
        for (const c of corners) {
            const p = c.clone().project(camera);
            x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
        }
        return (x1 - x0) / 2 <= cfg.fill[0] && (y1 - y0) / 2 <= cfg.fill[1];
    };
    const fitDistance = (dir) => {
        let lo = 2, hi = 40;
        for (let i = 0; i < 40; i++) {
            const mid = (lo + hi) / 2;
            fits(dir, mid) ? (hi = mid) : (lo = mid);
        }
        return hi;
    };
    const dPark = new THREE.Vector3(2.2, 0.75, 5.6).normalize();
    const fd = fitDistance(dPark);
    const pDrive = L.clone().addScaledVector(new THREE.Vector3(0.9, 0.42, 6.5).normalize(), fd * 1.18);
    const pPark = L.clone().addScaledVector(dPark, fd);
    const pEnd = L.clone().addScaledVector(new THREE.Vector3(3.0, 0.95, 5.0).normalize(), fd * 0.9);
    curve = new THREE.CatmullRomCurve3([pDrive, pPark, pEnd]);
    cfg.L = L;
    cfg.pDrive = pDrive;

    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 }));
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.4, 1.25));
    composer.addPass(new OutputPass());

    // compile everything once, so no frame waits for a shader
    renderer.compile(scene, camera);
    return { fd, lookY };
};

window.renderAt = (t) => {
    // the car
    const s = driven(t);
    const p = s / DIST;
    const z = -DIST * (1 - p);
    const x = START_X * (1 - p) * (1 - p);
    const yaw = Math.atan2(-2 * START_X * (1 - p), DIST);
    car.position.set(x, 0, z);
    car.rotation.set(pitch(t), yaw, 0);
    for (let i = 0; i < wheels.length; i++) wheels[i].rotation.x = wheelBase[i] - s / 0.34;

    // headlights: full on the road, dimmed to daytime lights once parked in the studio
    const on = lightsOn(t);
    for (const sp of headSpots) sp.intensity = 40 - 32 * on;
    car.updateMatrixWorld(true);
    for (const sprite of headSprites) {
        const d = sprite.getWorldPosition(new THREE.Vector3()).distanceTo(camera.position);
        const size = Math.max(0.32, d * 0.016) * (1 - 0.6 * on);
        sprite.scale.set(size, size, 1);
    }

    // the studio lights
    key.intensity = 1.6 * on;
    for (const sprite of headSprites) sprite.material.color.setScalar(6 - 3.5 * on);
    hemi.intensity = 0.25 + 0.05 * on;
    scene.environmentIntensity = 0.2 + 0.8 * on;

    // the inspection sweep
    const k = clamp01((t - T.sweepFrom) / (T.sweepTo - T.sweepFrom));
    const sx = -3.2 + 6.4 * easeInOut(k);
    inspect.position.x = sx;
    inspect.lookAt(sx, 0, 0);
    inspect.intensity = k > 0 && k < 1 ? 10 * Math.sin(Math.PI * k) : 0;
    sweepUniform.value = k <= 0 ? -10 : k >= 1 ? 10 : sx;

    // the camera: low and ahead while the car drives in, then round to the right and closer
    const look = new THREE.Vector3(car.position.x, cfg.L.y, car.position.z);
    const u = easeInOut((t - (T.stop - 0.3)) / (T.end - (T.stop - 0.3)));
    if (t < T.stop - 0.3) camera.position.copy(cfg.pDrive);
    else camera.position.copy(curve.getPoint(u));
    camera.lookAt(look);

    composer.render();
};

window.inspectScene = () => ({ scene, camera }); // for debugging from the console
window.sceneReady = true;
