<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { loadMotion, reducedMotion } from '@/lib/motion';
import Photo from '@/Components/Photo.vue';

// Three columns of photos that scroll at different speeds (the middle one runs against the
// page). Two columns on small screens. Each item: { image, alt, label, category, onClick }.
const props = defineProps({
    items: { type: Array, required: true },
    cursor: { type: String, default: 'View' },
});

const emit = defineEmits(['open']);
const root = ref(null);
let mm = null;
let alive = true;

const columns = [0, 1, 2].map((c) => props.items.map((item, i) => ({ item, i })).filter(({ i }) => i % 3 === c));

onMounted(async () => {
    if (reducedMotion()) return;
    const { gsap } = await loadMotion();
    if (!alive) return;
    mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
        root.value.querySelectorAll('.pg-col').forEach((col, i) => {
            gsap.fromTo(col, { yPercent: [4, 14, 8][i] }, {
                yPercent: [-6, 0, -10][i],
                ease: 'none',
                scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
    });
});

onBeforeUnmount(() => { alive = false; mm?.revert(); });
</script>

<template>
    <div ref="root" class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 overflow-hidden md:pb-24">
        <div v-for="(column, c) in columns" :key="c" class="pg-col flex flex-col gap-4 sm:gap-6" :class="c === 2 ? 'hidden md:flex' : ''">
            <button v-for="({ item, i }, k) in column" :key="i" type="button" @click="emit('open', i)" class="group relative block text-left" :data-cursor="cursor" :aria-label="item.label">
                <Photo :image="item.image" :alt="item.alt" sizes="(min-width: 768px) 30vw, 48vw" :reveal="(k + c) % 2 ? 'up' : 'diagonal'" :parallax="0" class="clip-cut" :class="(k + c) % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[3/4]'" img-class="transition-transform duration-[1.2s] ease-[var(--ease-forge)] group-hover:scale-105" />
                <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-ink/90 to-transparent">
                    <span v-if="item.category" class="block font-display text-[9px] tracking-[0.25em] text-signal mb-1.5">{{ item.category }}</span>
                    <span class="block font-display text-sm sm:text-base leading-tight text-white line-clamp-2">{{ item.label }}</span>
                </div>
            </button>
        </div>
    </div>
</template>
