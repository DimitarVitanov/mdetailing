<template>
    <Link :href="`/services/${service.slug}`" prefetch
          class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-2 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-signal/40 hover:shadow-[0_30px_60px_-30px_rgb(255_198_41/0.35)]">
        <div class="relative aspect-[16/11] overflow-hidden">
            <img v-bind="imageFor(service.image, servicePhoto(service))"
                 sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                 :alt="localized(service, 'name')" loading="lazy" decoding="async"
                 class="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]" />
            <div class="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent"></div>

            <span class="absolute left-5 top-5 font-display text-xs font-medium tracking-widest text-white/70">{{ String(index + 1).padStart(2, '0') }}</span>
            <span v-if="service.is_featured" class="absolute right-4 top-4 rounded-full bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                {{ t('services.popular') }}
            </span>
        </div>

        <div class="relative flex flex-1 flex-col p-6 pt-2">
            <h3 class="font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-signal md:text-xl">{{ localized(service, 'name') }}</h3>
            <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{{ localized(service, 'short_description') }}</p>

            <div class="mt-auto flex items-end justify-between gap-4 pt-6">
                <div>
                    <div v-if="price(service.price_from)" class="flex items-baseline gap-1.5">
                        <span class="text-[11px] font-semibold uppercase tracking-wider text-white/55">{{ t('services.from') }}</span>
                        <span class="font-display text-2xl font-semibold text-white">{{ price(service.price_from) }}</span>
                        <span v-if="price(service.price_to)" class="text-sm text-white/55">– {{ price(service.price_to) }}</span>
                    </div>
                    <div v-if="service.duration" class="mt-1.5 flex items-center gap-1.5 text-xs text-white/50">
                        <Icon name="clock" :size="14" /> {{ service.duration }}
                    </div>
                </div>
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
                    <Icon name="arrow-up-right" :size="18" />
                </span>
            </div>
        </div>
    </Link>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import { useI18n } from '@/i18n.js';
import { imageFor, servicePhoto } from '@/lib/img.js';

defineProps({
    service: { type: Object, required: true },
    index: { type: Number, default: 0 },
});

const { t, localized, price } = useI18n();
</script>
