<template>
    <figure class="card relative flex h-full flex-col p-7 md:p-8">
        <Icon name="quote" :size="34" class="text-signal/80" />
        <div class="mt-5 flex gap-0.5 text-signal" role="img" :aria-label="`${stars}/5`">
            <Icon v-for="star in stars" :key="star" name="star" :size="15" />
        </div>
        <blockquote class="mt-4 flex-1 text-[15px] leading-relaxed text-white/75">{{ localized(testimonial, 'content') }}</blockquote>
        <figcaption class="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-signal to-signal-deep font-display text-sm font-bold text-ink">
                {{ testimonial.client_name?.charAt(0) }}
            </span>
            <span class="min-w-0">
                <span class="block truncate font-semibold text-white">{{ testimonial.client_name }}</span>
                <span v-if="testimonial.client_vehicle" class="block truncate text-xs text-white/50">{{ testimonial.client_vehicle }}</span>
            </span>
        </figcaption>
    </figure>
</template>

<script setup>
import { computed } from 'vue';
import Icon from '@/Components/Icon.vue';
import { useI18n } from '@/i18n.js';

const props = defineProps({ testimonial: { type: Object, required: true } });
const { localized } = useI18n();

const stars = computed(() => Math.min(5, Math.max(0, Number(props.testimonial.rating) || 0)));
</script>
