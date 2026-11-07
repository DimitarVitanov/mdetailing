<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { observeReveal, unobserveReveal } from '@/directives/reveal';
import { reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';

// A heading whose lines rise one by one out of their own masks.
//   <MaskLines tag="h2" :lines="['Premium', { text: 'Car Care', class: 'text-signal' }]" />
// `hero` waits for the intro / page wipe instead of the scroll position.
const props = defineProps({
    lines: { type: Array, required: true },
    tag: { type: String, default: 'h2' },
    stagger: { type: Number, default: 110 },
    delay: { type: Number, default: 0 },
    hero: { type: Boolean, default: false },
});

const el = ref(null);
let cancel = () => {};

const line = (item) => (typeof item === 'string' ? { text: item } : item);

onMounted(() => {
    if (props.hero || reducedMotion()) {
        cancel = whenReady(() => requestAnimationFrame(() => el.value?.classList.add('is-revealed')));
    } else {
        observeReveal(el.value);
    }
});

onBeforeUnmount(() => {
    cancel();
    unobserveReveal(el.value);
});
</script>

<template>
    <component :is="tag" ref="el">
        <template v-for="(item, i) in lines" :key="i">
            <span v-if="line(item).text" class="mask-line">
                <span class="mask-line-inner" :class="line(item).class" :style="{ '--line-delay': `${delay + i * stagger}ms` }">{{ line(item).text }}</span>
            </span>{{ ' ' }}
        </template>
    </component>
</template>
