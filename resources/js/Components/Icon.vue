<template>
    <svg :viewBox="'0 0 24 24'" :width="size" :height="size" aria-hidden="true" focusable="false"
         :fill="icon.fill ? 'currentColor' : 'none'"
         :stroke="icon.fill ? 'none' : 'currentColor'"
         :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(d, i) in icon.d" :key="i" :d="d" />
    </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: { type: String, required: true },
    size: { type: [Number, String], default: 20 },
    strokeWidth: { type: [Number, String], default: 1.75 },
});

// Line icons in the Lucide style (24×24 grid), inlined so no icon library ships to the browser.
const ICONS = {
    'arrow-right': { d: ['M5 12h14', 'm12 5 7 7-7 7'] },
    'arrow-left': { d: ['M19 12H5', 'm12 19-7-7 7-7'] },
    'arrow-up-right': { d: ['M7 17 17 7', 'M7 7h10v10'] },
    'chevron-left': { d: ['m15 18-6-6 6-6'] },
    'chevron-right': { d: ['m9 18 6-6-6-6'] },
    phone: { d: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'] },
    'map-pin': { d: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0'] },
    clock: { d: ['M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0', 'M12 6v6l4 2'] },
    calendar: { d: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'] },
    mail: { d: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 6-10 7L2 6'] },
    menu: { d: ['M4 7h16', 'M4 12h16', 'M4 17h10'] },
    close: { d: ['M18 6 6 18', 'm6 6 12 12'] },
    check: { d: ['M20 6 9 17l-5-5'] },
    star: { fill: true, d: ['M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z'] },
    quote: { fill: true, d: ['M9.6 5C6.2 6.5 4 9.4 4 13.2V19h6v-6H7.1c.2-2.2 1.6-3.9 3.6-4.9L9.6 5zm10 0c-3.4 1.5-5.6 4.4-5.6 8.2V19h6v-6h-2.9c.2-2.2 1.6-3.9 3.6-4.9L19.6 5z'] },
    expand: { d: ['M15 3h6v6', 'M9 21H3v-6', 'M21 3l-7 7', 'M3 21l7-7'] },
    car: { d: ['M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2', 'M5 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0', 'M9 17h6', 'M15 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0'] },
    eye: { d: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0'] },
    droplet: { d: ['M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z'] },
    sparkles: { d: ['m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z', 'M5 3v4', 'M3 5h4', 'M19 17v4', 'M17 19h4'] },
    shield: { d: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'] },
    zap: { d: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'] },
    award: { d: ['M6 8a6 6 0 1 0 12 0 6 6 0 1 0-12 0', 'M15.48 12.89 17 22l-5-3-5 3 1.52-9.11'] },
    instagram: { d: ['M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z', 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', 'M17.5 6.5h.01'] },
    facebook: { d: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'] },
    tiktok: { fill: true, d: ['M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8.3 8.3 0 0 0 4.9 1.6V6.9a4.9 4.9 0 0 1-4.9-4.9z'] },
};

const icon = computed(() => ICONS[props.name] ?? { d: [] });
</script>
