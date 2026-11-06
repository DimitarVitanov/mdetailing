<template>
    <div :class="center ? 'text-center flex flex-col items-center' : ''">
        <span v-if="label" class="eyebrow">{{ label }}</span>
        <component :is="as" class="display mt-5 text-[clamp(1.85rem,4.6vw,3.6rem)]">
            <span class="chrome">{{ title }}</span>
            <template v-if="accent">{{ ' ' }}<span class="signal-text">{{ accent }}</span></template>
        </component>
        <p v-if="text" class="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg" :class="center ? 'mx-auto' : ''">{{ text }}</p>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    title: String,
    accent: String,
    text: String,
    center: Boolean,
    as: { type: String, default: 'h2' },
});
</script>
