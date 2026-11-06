<template>
    <!-- Before/after: the "after" photo is the base, "before" is clipped on top. A native range
         input drives it, so it works with touch, mouse and keyboard. -->
    <div class="relative select-none overflow-hidden rounded-2xl bg-ink-3">
        <img v-bind="after" sizes="(min-width: 1024px) 70vw, 100vw" :alt="`${alt} — ${afterLabel}`"
             class="block max-h-[75vh] w-full object-contain" />
        <img v-bind="before" sizes="(min-width: 1024px) 70vw, 100vw" :alt="`${alt} — ${beforeLabel}`"
             class="absolute inset-0 h-full w-full object-contain" :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }" />

        <div class="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_14px_rgb(255_255_255/0.7)]" :style="{ left: position + '%' }">
            <span class="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lg">
                <Icon name="chevron-left" :size="14" stroke-width="2.5" class="-mr-1" /><Icon name="chevron-right" :size="14" stroke-width="2.5" class="-ml-1" />
            </span>
        </div>
        <span class="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/85">{{ beforeLabel }}</span>
        <span class="pointer-events-none absolute right-3 top-3 rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">{{ afterLabel }}</span>

        <input v-model.number="position" type="range" min="0" max="100" step="0.5" :aria-label="hint"
               class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Icon from '@/Components/Icon.vue';

defineProps({
    before: { type: Object, required: true },
    after: { type: Object, required: true },
    alt: { type: String, default: '' },
    beforeLabel: { type: String, default: 'Before' },
    afterLabel: { type: String, default: 'After' },
    hint: { type: String, default: '' },
});

const position = ref(50);
</script>
