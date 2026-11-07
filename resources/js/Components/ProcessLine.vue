<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { loadMotion, reducedMotion } from '@/lib/motion';

// The process as a vertical LED line that lights up as you scroll through the steps; each
// step's hex node switches on when the light reaches it.
//   steps: [{ title, description }]
defineProps({ steps: { type: Array, required: true } });

const root = ref(null);
const fill = ref(null);
let tween = null;
let alive = true;

onMounted(async () => {
    if (reducedMotion()) {
        fill.value.style.transform = 'scaleY(1)';
        root.value.querySelectorAll('.node').forEach((n) => n.classList.add('is-lit'));
        return;
    }
    const { gsap } = await loadMotion();
    if (!alive) return;
    const nodes = [...root.value.querySelectorAll('.node')];
    tween = gsap.fromTo(fill.value, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: root.value,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.4,
            onUpdate: (self) => {
                const y = root.value.getBoundingClientRect().top + root.value.offsetHeight * self.progress;
                nodes.forEach((n) => n.classList.toggle('is-lit', n.getBoundingClientRect().top <= y));
            },
        },
    });
});

onBeforeUnmount(() => {
    alive = false;
    tween?.scrollTrigger?.kill();
    tween?.kill();
});
</script>

<template>
    <div ref="root" class="relative pl-10 sm:pl-0">
        <!-- the tube -->
        <div class="absolute top-0 bottom-0 left-3 sm:left-1/2 w-px bg-white/10"></div>
        <div ref="fill" class="absolute top-0 bottom-0 left-3 sm:left-1/2 w-px bg-led origin-top shadow-[0_0_14px_var(--color-led)]"></div>

        <ol class="space-y-14 sm:space-y-20">
            <li v-for="(step, i) in steps" :key="i" class="relative sm:grid sm:grid-cols-2 sm:gap-16" :class="i % 2 ? 'sm:text-left' : 'sm:text-right'">
                <span class="node absolute -left-10 sm:left-1/2 top-1 sm:-translate-x-1/2 grid place-items-center w-7 h-7 clip-hex bg-ink-3 transition-colors duration-500">
                    <span class="w-2.5 h-2.5 clip-hex bg-white/30 transition-[background-color,box-shadow] duration-500 node-dot"></span>
                </span>
                <div v-reveal="i % 2 ? 'right' : 'left'" :class="i % 2 ? 'sm:col-start-2' : 'sm:col-start-1'">
                    <span class="font-display text-[10px] tracking-[0.3em] text-signal">{{ String(i + 1).padStart(2, '0') }}</span>
                    <h3 class="font-display text-2xl sm:text-3xl leading-tight mt-2 mb-3">{{ step.title }}</h3>
                    <p class="text-body leading-relaxed max-w-md" :class="i % 2 ? '' : 'sm:ml-auto'">{{ step.description }}</p>
                </div>
            </li>
        </ol>
    </div>
</template>

<style scoped>
.node.is-lit { background: rgb(191 233 255 / 0.15); }
.node.is-lit .node-dot { background: var(--color-led); box-shadow: 0 0 14px var(--color-led); }
</style>
