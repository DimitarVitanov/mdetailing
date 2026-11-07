<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { gsap, reducedMotion, ScrollTrigger } from '@/lib/motion';
import Icon from '@/Components/Icon.vue';
import Photo from '@/Components/Photo.vue';
import { useI18n } from '@/i18n.js';
import { imageFor, servicePhoto } from '@/lib/img.js';

// The services as a rail: a list you scroll through on the left while the photo on the right
// stays put and switches to the service that is in front of you. On phones each service
// carries its own photo.
defineProps({ services: { type: Array, required: true } });

const { t, localized, price } = useI18n();
const root = ref(null);
const active = ref(0);
let mm = null;

onMounted(() => {
    if (reducedMotion()) return;
    mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
        const triggers = [...root.value.querySelectorAll('.rail-item')].map((item, i) =>
            ScrollTrigger.create({ trigger: item, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => { if (self.isActive) active.value = i; } }),
        );
        return () => triggers.forEach((trigger) => trigger.kill());
    });
});

onBeforeUnmount(() => mm?.revert());
</script>

<template>
    <div ref="root" class="relative grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20">
        <ol class="relative">
            <li v-for="(service, i) in services" :key="service.id" class="rail-item group border-t border-white/[0.08] last:border-b py-8 lg:py-12 transition-opacity duration-500" :class="active === i ? 'lg:opacity-100' : 'lg:opacity-40 lg:hover:opacity-80'">
                <Link :href="`/services/${service.slug}`" class="block" :data-cursor="t('services.details')" @mouseenter="active = i">
                    <!-- phones: the photo rides with the item -->
                    <Photo :image="imageFor(service.image, servicePhoto(service))" :alt="localized(service, 'name')" sizes="100vw" reveal="up" :parallax="6" class="lg:hidden aspect-[16/10] clip-cut mb-6" />
                    <div class="flex items-start gap-5 sm:gap-8">
                        <span class="font-display text-sm text-signal pt-2 w-8 shrink-0">{{ String(i + 1).padStart(2, '0') }}</span>
                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-6">
                                <h3 class="font-display text-2xl sm:text-3xl xl:text-4xl leading-[1.05] transition-colors" :class="active === i ? 'text-white' : ''">{{ localized(service, 'name') }}</h3>
                                <span class="hidden sm:grid shrink-0 w-11 h-11 place-items-center border border-white/15 clip-cut-sm transition-colors duration-300 group-hover:bg-signal group-hover:text-ink group-hover:border-signal"><Icon name="arrow-up-right" :size="16" /></span>
                            </div>
                            <p class="mt-3 text-body text-sm sm:text-base leading-relaxed max-w-md">{{ localized(service, 'short_description') }}</p>
                            <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-[11px] tracking-[0.2em]">
                                <span class="text-white"><span class="text-steel mr-2">{{ t('services.from') }}</span>{{ price(service.price_from) }}<span v-if="price(service.price_to)" class="text-steel"> – {{ price(service.price_to) }}</span></span>
                                <span v-if="service.duration" class="inline-flex items-center gap-2 text-steel"><Icon name="clock" :size="13" class="text-led" /> {{ service.duration }}</span>
                                <span v-if="service.is_featured" class="text-signal">{{ t('services.popular') }}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </li>
        </ol>

        <!-- desktop: the sticky photo, one layer per service -->
        <div class="hidden lg:block">
            <div class="sticky top-28 aspect-[4/5] max-h-[calc(100vh-9rem)] clip-cut [--cut:34px] overflow-hidden bg-ink-3">
                <div v-for="(service, i) in services" :key="service.id" class="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-forge)]" :class="active === i ? 'opacity-100' : 'opacity-0'" aria-hidden="true">
                    <Photo :image="imageFor(service.image, servicePhoto(service))" alt="" sizes="50vw" reveal="none" :parallax="10" class="absolute inset-0" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none"></div>
                <div class="absolute left-8 bottom-8 right-8 flex items-end justify-between">
                    <span class="font-display text-[8rem] leading-none text-outline-signal">{{ String(active + 1).padStart(2, '0') }}</span>
                    <Link :href="`/contact?service=${services[active]?.id}`" class="btn-signal">{{ t('nav.bookNow') }}</Link>
                </div>
                <div class="led absolute top-0 inset-x-0 opacity-70"></div>
            </div>
        </div>
    </div>
</template>
