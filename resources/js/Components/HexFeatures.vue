<script setup>
import Icon from '@/Components/Icon.vue';
import Photo from '@/Components/Photo.vue';
import { photo } from '@/lib/img.js';

// The reasons to choose the studio, laid out like its ceiling: a honeycomb of hex tiles that
// light up as they scroll in. Below lg they become cut cards in two columns.
//   features: [{ title, text, icon, image }]
defineProps({ features: { type: Array, required: true } });

// Column offsets for the honeycomb (every second tile sits half a tile lower).
const offset = (i) => (i % 2 ? 'lg:mt-[9rem]' : '');
</script>

<template>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:-mx-3">
        <article v-for="(feature, i) in features" :key="i" v-reveal:[i*120]="'scale'" class="hex-tile group relative lg:mx-[-2%]" :class="offset(i)">
            <div class="relative aspect-[4/5] sm:aspect-[1/1.08] lg:aspect-[0.866/1] clip-cut lg:[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] bg-ink-3 overflow-hidden">
                <Photo :image="photo(feature.image)" alt="" sizes="(min-width: 1024px) 26vw, 50vw" reveal="none" :parallax="0" class="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-55" img-class="grayscale group-hover:grayscale-0 transition-[filter] duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20"></div>
                <!-- the tube around the tile lights up -->
                <div class="hex-light absolute inset-0 transition-opacity duration-700" style="box-shadow: inset 0 0 0 2px var(--color-led), inset 0 0 28px rgb(191 233 255 / 0.35);"></div>
                <div class="relative h-full flex flex-col justify-end p-7 lg:p-10 lg:pb-14 lg:text-center lg:items-center">
                    <span class="inline-grid place-items-center w-12 h-12 mb-5 bg-signal text-ink clip-hex transition-transform duration-500 group-hover:-translate-y-1"><Icon :name="feature.icon" :size="22" /></span>
                    <span class="font-display text-[9px] tracking-[0.3em] text-led mb-2">{{ String(i + 1).padStart(2, '0') }}</span>
                    <h3 class="font-display text-lg xl:text-xl leading-tight mb-3">{{ feature.title }}</h3>
                    <p class="text-body text-sm leading-relaxed lg:max-w-[14rem]">{{ feature.text }}</p>
                </div>
            </div>
        </article>
    </div>
</template>

<style scoped>
.hex-light { opacity: 0; }
.hex-tile.is-revealed .hex-light { opacity: 0.55; animation: led-flicker 1.1s steps(1, end) both; }
.hex-tile:hover .hex-light { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .hex-light { opacity: 0.55 !important; animation: none !important; } }
</style>
