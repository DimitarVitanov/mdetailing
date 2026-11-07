<template>
    <!-- ============ INTRO ============ -->
    <section class="relative min-h-[100svh] overflow-hidden pt-28 sm:pt-32 pb-16 grain">
        <div class="absolute inset-0 opacity-50"><Sparks :density="0.6" /></div>
        <div class="relative container-x grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:min-h-[calc(100svh-12rem)]">
            <div class="order-2 lg:order-1">
                <nav class="hero-fade flex items-center gap-3 font-display text-[10px] tracking-[0.25em] text-steel mb-8" style="--d: 50ms" aria-label="Breadcrumb">
                    <Link href="/" class="hover:text-white transition-colors">{{ t('footer.home') }}</Link>
                    <span class="w-5 h-px bg-led"></span>
                    <Link href="/services" class="hover:text-white transition-colors">{{ t('nav.services') }}</Link>
                    <span class="w-5 h-px bg-led"></span>
                    <span class="text-white truncate max-w-[12rem]">{{ name }}</span>
                </nav>
                <p v-if="service.is_featured" class="hero-fade eyebrow mb-6" style="--d: 100ms">{{ t('services.popular') }}</p>
                <MaskLines tag="h1" hero :delay="150" class="font-display text-[11vw] sm:text-6xl xl:text-7xl leading-[0.92]" :lines="titleLines" />
                <p class="hero-fade mt-8 text-body text-lg leading-relaxed max-w-lg" style="--d: 600ms">{{ localized(service, 'short_description') }}</p>

                <div class="hero-fade mt-10 grid grid-cols-2 max-w-md border-y border-white/[0.08] divide-x divide-white/[0.08]" style="--d: 700ms">
                    <div class="py-5 pr-6">
                        <p class="s-label mb-2">{{ t('serviceDetailPage.price') }}</p>
                        <p class="font-display text-3xl sm:text-4xl text-white leading-none"><span class="text-xs text-steel tracking-[0.2em] mr-2">{{ t('services.from') }}</span>{{ price(service.price_from) }}</p>
                        <p v-if="price(service.price_to)" class="text-xs text-steel mt-2">{{ t('serviceDetailPage.upTo') }} {{ price(service.price_to) }}</p>
                    </div>
                    <div class="py-5 pl-6">
                        <p class="s-label mb-2">{{ t('serviceDetailPage.duration') }}</p>
                        <p class="font-display text-xl sm:text-2xl text-white leading-none flex items-center gap-3"><Icon name="clock" :size="20" class="text-led" /> {{ service.duration || '—' }}</p>
                    </div>
                </div>
                <p class="hero-fade mt-3 text-xs text-steel max-w-md" style="--d: 750ms">{{ t('serviceDetailPage.priceNote') }}</p>

                <div class="hero-fade mt-10 flex flex-wrap gap-4" style="--d: 850ms">
                    <Link :href="`/contact?service=${service.id}`" class="btn-signal">{{ t('serviceDetailPage.bookThis') }} <Icon name="arrow-right" :size="15" /></Link>
                    <a v-if="phone" :href="telHref(phone)" class="btn-ghost"><Icon name="phone" :size="15" /> {{ phone }}</a>
                </div>
            </div>

            <div class="order-1 lg:order-2 relative h-[400px] sm:h-[560px] lg:h-[640px]">
                <Photo hero priority :image="imageFor(service.image, servicePhoto(service))" :alt="name" sizes="(min-width: 1024px) 45vw, 100vw" reveal="diagonal" :parallax="12" class="absolute inset-0 clip-cut [--cut:34px]" />
                <div class="led absolute top-0 inset-x-10 opacity-70"></div>
                <span class="hero-fade absolute -left-3 bottom-8 font-display text-[7rem] sm:text-[10rem] leading-none text-outline-signal select-none" style="--d: 900ms" aria-hidden="true">{{ String(service.sort_order || service.id).padStart(2, '0') }}</span>
            </div>
        </div>
    </section>

    <!-- ============ DESCRIPTION ============ -->
    <section v-if="localized(service, 'description')" class="relative bg-ink-2 border-y border-white/[0.06] py-20 md:py-28">
        <div class="hex-grid absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        <div class="relative container-x grid lg:grid-cols-12 gap-12">
            <div v-reveal class="rich-text lg:col-span-7" v-html="localized(service, 'description')"></div>
            <aside class="lg:col-span-4 lg:col-start-9">
                <div v-reveal:150 class="sticky top-28 bg-ink-3 border border-white/[0.07] clip-cut p-8">
                    <Icon name="calendar" :size="26" class="text-signal" />
                    <h2 class="mt-5 font-display text-xl leading-tight">{{ c('servicesPage.ctaTitle') }}</h2>
                    <p class="mt-3 text-sm text-body leading-relaxed">{{ c('servicesPage.ctaText') }}</p>
                    <Link :href="`/contact?service=${service.id}`" class="btn-signal mt-6 w-full">{{ t('serviceDetailPage.bookThis') }}</Link>
                    <a v-if="phone" :href="telHref(phone)" class="btn-ghost mt-3 w-full"><Icon name="phone" :size="15" /> {{ phone }}</a>
                </div>
            </aside>
        </div>
    </section>

    <!-- ============ WORK FOR THIS SERVICE ============ -->
    <section v-if="gallery.length" class="relative py-24 md:py-32 overflow-hidden">
        <div class="container-x">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                    <p v-reveal class="eyebrow mb-5">{{ c('portfolio.label') }}</p>
                    <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[t('serviceDetailPage.gallery')]" />
                </div>
                <Link v-reveal:200 href="/portfolio" class="link-arrow self-start md:self-auto">{{ c('portfolio.viewAll') }}</Link>
            </div>
            <ParallaxGallery :items="gallery" :cursor="t('portfolio.open')" @open="() => router.visit('/portfolio')" />
        </div>
    </section>

    <!-- ============ OTHER SERVICES ============ -->
    <section v-if="related.length" class="relative bg-ink-2 border-t border-white/[0.06] py-24 md:py-32">
        <div class="container-x">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                    <p v-reveal class="eyebrow mb-5">{{ c('services.label') }}</p>
                    <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[t('serviceDetailPage.related')]" />
                </div>
                <Link v-reveal:200 href="/services" class="link-arrow self-start md:self-auto">{{ t('serviceDetailPage.backToServices') }}</Link>
            </div>
            <ServiceRail :services="related" />
        </div>
    </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import Icon from '@/Components/Icon.vue';
import MaskLines from '@/Components/MaskLines.vue';
import ParallaxGallery from '@/Components/ParallaxGallery.vue';
import Photo from '@/Components/Photo.vue';
import ServiceRail from '@/Components/ServiceRail.vue';
import Sparks from '@/Components/SparksLazy.js';
import { telHref, useI18n } from '@/i18n.js';
import { imageFor, portfolioPhoto, servicePhoto } from '@/lib/img.js';
import { whenReady } from '@/lib/intro';

defineOptions({ layout: MainLayout });

const props = defineProps({
    service: { type: Object, required: true },
    related: { type: Array, default: () => [] },
});

const { t, c, localized, price } = useI18n();
const name = computed(() => localized(props.service, 'name'));
const phone = computed(() => c('footer.phone'));

// Split the name into two lines, the last word in signal.
const titleLines = computed(() => {
    const words = name.value.split(' ');
    if (words.length === 1) return [{ text: words[0], class: 'text-signal' }];
    const last = words.pop();
    return [words.join(' '), { text: last, class: 'text-signal' }];
});

const gallery = computed(() => (props.service.portfolio_items || []).slice(0, 6).map((item) => ({ image: imageFor(item.after_image || item.before_image, portfolioPhoto(item)), alt: localized(item, 'title'), label: localized(item, 'title'), category: item.category })));

let cancel = () => {};
onMounted(() => { cancel = whenReady(() => document.querySelectorAll('.hero-fade').forEach((el) => el.classList.add('is-in'))); });
onBeforeUnmount(() => cancel());
</script>

<style scoped>
.hero-fade { opacity: 0; transform: translateY(24px); transition: opacity 1s var(--ease-forge), transform 1.2s var(--ease-forge); transition-delay: var(--d, 0ms); }
.hero-fade.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .hero-fade { opacity: 1; transform: none; transition: none; } }
</style>
