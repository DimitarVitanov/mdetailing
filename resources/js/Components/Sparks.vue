<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';

// Light motes drifting up through the studio: a light 2D canvas, paused when off screen or in
// a background tab. Nothing is drawn for visitors who prefer reduced motion.
const props = defineProps({
    density: { type: Number, default: 1 },
    colors: { type: Array, default: () => ['255,198,41', '255,217,102', '255,255,255', '215,220,226'] },
});

const canvas = ref(null);
let ctx = null;
let raf = null;
let motes = [];
let w = 0;
let h = 0;
let visible = false;
let io = null;
let ro = null;
let ready = false;
let cancelReady = () => {};

const SPRITE = 32;
const sprites = new Map();

function sprite(color) {
    if (sprites.has(color)) return sprites.get(color);
    const s = document.createElement('canvas');
    s.width = s.height = SPRITE;
    const g = s.getContext('2d');
    const glow = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    glow.addColorStop(0, `rgba(${color},0.9)`);
    glow.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = glow;
    g.fillRect(0, 0, SPRITE, SPRITE);
    sprites.set(color, s);
    return s;
}

function spawn(initial = false) {
    return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        r: Math.random() * 1.6 + 0.4,
        vy: Math.random() * 0.5 + 0.2,
        drift: Math.random() * Math.PI * 2,
        sway: Math.random() * 0.5 + 0.15,
        life: Math.random() * 0.6 + 0.3,
        sprite: sprite(props.colors[Math.floor(Math.random() * props.colors.length)]),
    };
}

function resize() {
    const rect = canvas.value.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.value.width = w;
    canvas.value.height = h;
    motes = Array.from({ length: Math.round((w / 1440) * 60 * props.density) + 10 }, () => spawn(true));
}

function frame() {
    raf = null;
    if (!visible || document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.drift += 0.02;
        m.x += Math.sin(m.drift) * m.sway;
        m.y -= m.vy;
        const fade = Math.max(0, Math.min(1, m.y / h)) * m.life;
        if (m.y < -10) motes[i] = spawn();
        const size = m.r * 12;
        ctx.globalAlpha = fade;
        ctx.drawImage(m.sprite, m.x - size / 2, m.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
}

function wake() {
    if (!raf && ready && visible && !document.hidden) raf = requestAnimationFrame(frame);
}

onMounted(() => {
    if (reducedMotion()) return;
    ctx = canvas.value.getContext('2d');
    resize();
    ro = new ResizeObserver(resize);
    ro.observe(canvas.value);
    io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); });
    io.observe(canvas.value);
    document.addEventListener('visibilitychange', wake);
    cancelReady = whenReady(() => { ready = true; wake(); });
});

onBeforeUnmount(() => {
    cancelReady();
    if (raf) cancelAnimationFrame(raf);
    io?.disconnect();
    ro?.disconnect();
    document.removeEventListener('visibilitychange', wake);
});
</script>

<template>
    <canvas ref="canvas" class="block w-full h-full pointer-events-none" aria-hidden="true"></canvas>
</template>
