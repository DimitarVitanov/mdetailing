// The home page's 3D opening scene (Three.js), loaded after the first paint:
// a dark studio floor with LED lines rushing past, and the car drives in from far away towards
// the camera, headlights on, wheels turning; it brakes right in front, a light bar sweeps over
// it and the paint turns from dull to showroom gloss; then the camera drifts slowly around it.
//
//   const scene = await createCarScene(canvas, { onArrived });
//   scene.setScroll(progress); scene.destroy();
//
// Model: Ferrari 458 Italia by vicent091036 (Sketchfab, CC BY 4.0), from the three.js examples.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const INK = 0x07080a;
const LED = 0xbfe9ff;
const SIGNAL = 0xffc629;

const DRIVE_FROM = -75; // z where the car appears (in the fog)
const DRIVE_MS = 3400; // the approach
const SWEEP_AT = 3700; // ms: the light bar starts
const SWEEP_MS = 1500;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const expoOut = (t) => 1 - Math.pow(2, -10 * t);
// Fast from far away, braking hard over the last stretch.
const approach = (t) => (t < 0.78 ? Math.pow(t / 0.78, 0.9) * 0.88 : 0.88 + 0.12 * expoOut((t - 0.78) / 0.22));

export async function createCarScene(canvas, { onArrived = () => {}, reduced = false, mobile = false } = {}) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setClearColor(INK, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(INK, 0.032);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // The camera aims a little above the car, so the car sits in the lower half of the frame
    // under the headline.
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
    const camFrom = new THREE.Vector3(0.4, 1.7, 8.4);
    const camTo = new THREE.Vector3(-3.4, 1.4, 6.6);
    const look = new THREE.Vector3(0, 1.65, 0);
    let orbitScale = 1; // the final drift is shorter on portrait screens, so the car stays in frame
    camera.position.copy(camFrom);

    // ── floor: dark, slightly reflective, with LED lines running into the distance ──
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.MeshStandardMaterial({ color: 0x06070a, roughness: 0.5, metalness: 0.4, envMapIntensity: 0.07 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const lines = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: LED, transparent: true, opacity: 0.55 });
    const pts = [];
    for (let z = -140; z <= 20; z += 3) pts.push(new THREE.Vector3(-9, 0.005, z), new THREE.Vector3(9, 0.005, z)); // rungs
    for (const x of [-9, -3.2, 3.2, 9]) pts.push(new THREE.Vector3(x, 0.005, -140), new THREE.Vector3(x, 0.005, 20)); // rails
    lines.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    scene.add(lines);

    // ── light ──
    scene.add(new THREE.HemisphereLight(0x8aa6bd, 0x05060a, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(LED, 1.2);
    rim.position.set(-6, 5, -8);
    scene.add(rim);

    // the "detail light": a glowing bar that sweeps over the car once it has parked
    // (the light itself is what shows: a moving reflection over the paint and the floor)
    const bar = new THREE.Group();
    const barLight = new THREE.PointLight(LED, 0, 9, 1.6);
    bar.add(barLight);
    bar.position.set(-4, 2.4, 0.4);
    bar.visible = false;
    scene.add(bar);

    // ── the car ──
    const car = new THREE.Group();
    car.position.set(-1.4, 0, DRIVE_FROM);
    scene.add(car);

    const dull = { color: new THREE.Color(0x4a0d12), roughness: 0.85, metalness: 0.35, clearcoat: 0.0 };
    const gloss = { color: new THREE.Color(0xd4101c), roughness: 0.32, metalness: 0.9, clearcoat: 1.0 };
    const body = new THREE.MeshPhysicalMaterial({ ...dull, clearcoatRoughness: 0.04 });
    const details = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.45 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });

    const wheels = [];
    const headlights = [];
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    loader.setDRACOLoader(draco);

    const gltf = await loader.loadAsync('/models/ferrari.glb');
    const model = gltf.scene.children[0];
    // The model's nose points to -z; turned round, it faces the camera (+z) as it drives in.
    model.rotation.y = Math.PI;
    model.getObjectByName('body').material = body;
    for (const n of ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim']) model.getObjectByName(n).material = details;
    model.getObjectByName('glass').material = glass;
    for (const n of ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']) wheels.push(model.getObjectByName(n));

    // contact shadow under the car
    const shadowTex = await new THREE.TextureLoader().loadAsync('/models/ferrari_ao.png');
    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
        new THREE.MeshBasicMaterial({ map: shadowTex, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true, premultipliedAlpha: true }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.renderOrder = 2;
    model.add(shadow);

    // headlights at the nose (model -z): two spots, plus small glowing discs so they read from far away
    for (const x of [-0.62, 0.62]) {
        const lamp = new THREE.SpotLight(0xeaf6ff, 14, 40, 0.5, 0.45, 1.4);
        lamp.position.set(x, 0.62, -2.0);
        lamp.target.position.set(x * 1.6, 0.2, -12);
        model.add(lamp, lamp.target);
        const disc = new THREE.Mesh(new THREE.CircleGeometry(0.065, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        disc.position.set(x, 0.62, -2.02);
        disc.rotation.y = Math.PI;
        model.add(disc);
        headlights.push(lamp);
    }
    // tail lights (model +z)
    for (const x of [-0.5, 0.5]) {
        const disc = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), new THREE.MeshBasicMaterial({ color: 0xff2a2a }));
        disc.position.set(x, 0.75, 2.28);
        model.add(disc);
    }
    car.add(model);

    // ── the drive ──
    let start = null;
    let arrived = false;
    let scroll = 0;
    let raf = null;
    let running = true;
    let lastT = 0;
    const tmp = new THREE.Vector3();

    function frame() {
        raf = null;
        if (!running) return;
        const now = performance.now();
        start ??= now;
        const t = reduced ? 1e9 : now - start;
        const dt = Math.min(0.05, (now - (lastT || now)) / 1000);
        lastT = now;

        // approach: z from far away to 0, drifting from the left into the middle
        const d = clamp01(t / DRIVE_MS);
        const a = approach(d);
        const z = DRIVE_FROM * (1 - a);
        const speed = (z - car.position.z) / Math.max(dt, 1e-3); // m/s, for the wheels and the road
        car.position.z = z;
        car.position.x = -1.4 * (1 - a);
        // nose dips under braking, settles after
        const brake = d > 0.8 && d < 1 ? Math.sin(clamp01((d - 0.8) / 0.2) * Math.PI) : 0;
        car.rotation.x = -0.035 * brake;
        for (const w of wheels) w.rotation.x -= (speed * dt) / 0.34; // forward is the model's -z
        lines.position.z = ((lines.position.z + speed * dt) % 3 + 3) % 3;

        if (d >= 1 && !arrived) {
            arrived = true;
            onArrived();
        }

        // the light bar sweeps across the parked car; the paint turns glossy behind it
        const s = clamp01((t - SWEEP_AT) / SWEEP_MS);
        if (s > 0 && s < 1) {
            bar.visible = true;
            bar.position.x = -4 + 8 * s;
            barLight.intensity = 60 * Math.sin(s * Math.PI);
        } else {
            bar.visible = false;
        }
        const g = clamp01((t - SWEEP_AT - 150) / SWEEP_MS);
        body.color.copy(dull.color).lerp(gloss.color, g);
        body.roughness = dull.roughness + (gloss.roughness - dull.roughness) * g;
        body.metalness = dull.metalness + (gloss.metalness - dull.metalness) * g;
        body.clearcoat = dull.clearcoat + (gloss.clearcoat - dull.clearcoat) * g;
        for (const l of headlights) l.intensity = 14 * (1 - 0.6 * g);

        // camera: ahead and slightly right during the drive, then a slow drift around the car,
        // further back and lower as the page is scrolled
        const orbit = clamp01((t - DRIVE_MS) / 3200);
        const wobble = arrived ? Math.sin(now / 2600) * 0.25 : 0;
        tmp.copy(camFrom).lerp(camTo, expoOut(orbit) * orbitScale);
        tmp.x += wobble;
        tmp.y += scroll * 1.4;
        tmp.z += scroll * 3.0;
        camera.position.copy(tmp);
        camera.lookAt(look.x, look.y + scroll * 0.3, look.z);
        camera.fov = baseFov;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
    }

    let baseFov = 38;
    function resize(width, height) {
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // keep the car in frame on tall phone screens
        baseFov = width < height ? 54 : 38;
        orbitScale = width < height ? 0.4 : 1;
        camera.fov = baseFov;
        camera.updateProjectionMatrix();
    }

    return {
        start() {
            if (!raf && running) raf = requestAnimationFrame(frame);
        },
        pause() {
            if (raf) cancelAnimationFrame(raf);
            raf = null;
            lastT = 0;
        },
        resize,
        setScroll(p) {
            scroll = clamp01(p);
        },
        destroy() {
            running = false;
            if (raf) cancelAnimationFrame(raf);
            scene.traverse((o) => {
                o.geometry?.dispose?.();
                const m = o.material;
                if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
                else m?.dispose?.();
            });
            shadowTex.dispose();
            scene.environment?.dispose?.();
            draco.dispose();
            renderer.dispose();
        },
    };
}
