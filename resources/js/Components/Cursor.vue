<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap, finePointer, reducedMotion } from '@/lib/motion';

// A small hex that trails the pointer on desktop and opens up over links, buttons and anything
// with data-cursor="Label". The system cursor stays visible.
const hex = ref(null);
const label = ref('');
const active = ref(false);
const shown = ref(false);
let tick = null;
const pos = { x: -100, y: -100 };
const target = { x: -100, y: -100 };

function onMove(e) {
    target.x = e.clientX;
    target.y = e.clientY;
    shown.value = true;
    const hit = e.target.closest?.('[data-cursor], a, button, label, input[type="range"]');
    active.value = !!hit;
    label.value = hit?.dataset?.cursor ?? '';
}
const onLeave = () => (shown.value = false);

onMounted(() => {
    if (!finePointer() || reducedMotion()) return;
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    tick = () => {
        pos.x += (target.x - pos.x) * 0.22;
        pos.y += (target.y - pos.y) * 0.22;
        if (hex.value) hex.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    gsap.ticker.add(tick);
});

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    if (tick) gsap.ticker.remove(tick);
});
</script>

<template>
    <div ref="hex" class="pointer-events-none fixed left-0 top-0 z-[150] hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden="true">
        <div class="-translate-x-1/2 -translate-y-1/2 clip-hex flex items-center justify-center transition-[width,height,background-color,opacity] duration-300 ease-[var(--ease-forge)]"
             :class="[shown ? 'opacity-100' : 'opacity-0', label ? 'w-24 h-24 bg-signal' : active ? 'w-12 h-12 bg-led/25' : 'w-5 h-5 bg-led/60']">
            <span class="font-display text-[9px] tracking-[0.2em] text-ink text-center leading-tight px-2 transition-opacity" :class="label ? 'opacity-100' : 'opacity-0'">{{ label }}</span>
        </div>
    </div>
</template>
