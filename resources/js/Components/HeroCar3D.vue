<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { finePointer, loadMotion, reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';
import { afterFirstPaint } from '@/lib/img';

// The home page's opening scene: a real 3D car (lib/carScene.js) that drives in from far away
// and parks in front of the camera. Three.js and the model are fetched after the first paint;
// until the scene is ready the LED road below is all there is. Emits 'arrived' when the car
// has stopped (or at once when the scene can't run), so the words can come in.
const emit = defineEmits(['arrived']);

const canvas = ref(null);
const box = ref(null);
const ready = ref(false);
let scene = null;
let trigger = null;
let ro = null;
let io = null;
let alive = true;
let visible = true;

const webgl = () => {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
        return false;
    }
};

function wake() {
    if (scene && visible && !document.hidden) scene.start();
    else scene?.pause();
}

onMounted(() => {
    if (!webgl()) {
        emit('arrived');
        return;
    }
    afterFirstPaint(async () => {
        try {
            const { createCarScene } = await import('@/lib/carScene.js');
            if (!alive) return;
            scene = await createCarScene(canvas.value, { onArrived: () => emit('arrived'), reduced: reducedMotion(), mobile: !finePointer() });
            if (!alive) return scene.destroy();
            const fit = () => scene.resize(box.value?.clientWidth, box.value?.clientHeight);
            fit();
            ro = new ResizeObserver(fit);
            ro.observe(box.value);
            io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
            io.observe(box.value);
            document.addEventListener('visibilitychange', wake);
            // the drive starts once the intro has let go of the screen
            whenReady(() => {
                ready.value = true;
                wake();
            });
            const { ScrollTrigger } = await loadMotion();
            if (!alive) return;
            trigger = ScrollTrigger.create({ trigger: box.value, start: 'top top', end: 'bottom top', scrub: 0.6, onUpdate: (self) => scene?.setScroll(self.progress) });
        } catch (e) {
            console.warn('3D scene unavailable', e);
            emit('arrived');
        }
    });
});

onBeforeUnmount(() => {
    alive = false;
    document.removeEventListener('visibilitychange', wake);
    ro?.disconnect();
    io?.disconnect();
    trigger?.kill();
    scene?.destroy();
});
</script>

<template>
    <div ref="box" class="absolute inset-0 overflow-hidden bg-ink">
        <!-- the LED road, shown until the 3D scene takes over (and underneath it while it loads) -->
        <div class="absolute inset-x-0 bottom-0 h-[62%] [perspective:520px] pointer-events-none transition-opacity duration-700" :class="ready ? 'opacity-0' : 'opacity-100'" aria-hidden="true">
            <div class="absolute inset-0 origin-bottom [transform:rotateX(66deg)]">
                <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(90deg, transparent calc(50% - 1px), rgb(191 233 255 / 0.5) 50%, transparent calc(50% + 1px)); background-size: 24% 100%;"></div>
                <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(180deg, rgb(191 233 255 / 0.55) 0 2px, transparent 2px 100%); background-size: 100% 11%;"></div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-transparent"></div>
        </div>
        <canvas ref="canvas" class="absolute inset-0 w-full h-full transition-opacity duration-700" :class="ready ? 'opacity-100' : 'opacity-0'" aria-hidden="true"></canvas>
        <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent pointer-events-none"></div>
    </div>
</template>
