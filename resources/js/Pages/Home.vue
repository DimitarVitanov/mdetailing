<template>
    <!-- ============ HERO: before → after ============ -->
    <section class="relative min-h-[100svh] overflow-hidden grain">
        <BeforeAfter :image="photo('gallery-01')" :alt="c('hero.badge')" position="center 45%" :rest="58" :before-label="t('portfolioPage.before')" :after-label="t('portfolioPage.after')" class="absolute inset-0" />
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/10 to-transparent pointer-events-none"></div>
        <div class="absolute inset-0 pointer-events-none"><Sparks :density="0.8" /></div>

        <div class="relative container-x min-h-[100svh] flex flex-col justify-end pt-32 pb-24 lg:pb-28">
            <div class="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
                <div>
                    <p class="hero-fade eyebrow mb-7" style="--d: 100ms">{{ c('hero.badge') }}</p>
                    <MaskLines tag="h1" hero :delay="150" class="font-display text-[10.5vw] sm:text-[9vw] lg:text-[6.6vw] 2xl:text-[7.5rem] leading-[0.9] drop-shadow-[0_6px_30px_rgba(0,0,0,0.55)]"
                               :lines="[c('hero.title1'), { text: c('hero.title2'), class: 'text-signal' }, { text: c('hero.title3'), class: 'text-outline' }]" />
                    <p class="hero-fade mt-8 text-body text-base sm:text-lg leading-relaxed max-w-md" style="--d: 700ms">{{ c('hero.subtitle') }}</p>
                    <div class="hero-fade mt-9 flex flex-col sm:flex-row gap-4" style="--d: 850ms">
                        <Link href="/contact" class="btn-signal">{{ c('hero.cta') }} <Icon name="arrow-right" :size="15" /></Link>
                        <Link href="/services" class="btn-ghost">{{ c('hero.ctaSecondary') }}</Link>
                    </div>
                </div>

                <!-- inspection sheet -->
                <dl v-if="stats.length" class="hero-fade hidden lg:block justify-self-end w-64 border-l border-led/40 pl-6 space-y-5" style="--d: 1000ms">
                    <div v-for="s in stats.slice(0, 3)" :key="s.label" class="flex items-baseline justify-between gap-4 border-b border-white/[0.08] pb-4 last:border-0">
                        <dt class="font-display text-[9px] tracking-[0.3em] text-steel">{{ s.label }}</dt>
                        <dd class="font-display text-2xl text-chrome">{{ s.value }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <p class="hero-fade absolute right-6 bottom-6 hidden lg:flex items-center gap-3 font-display text-[9px] tracking-[0.3em] text-steel" style="--d: 1100ms">{{ t('hero.scroll') }} <span class="w-10 h-px bg-led shadow-[0_0_8px_var(--color-led)]"></span></p>
    </section>

    <!-- ============ LED TICKER ============ -->
    <section class="relative py-5 border-y border-white/[0.06] bg-ink-2 text-2xl sm:text-4xl" aria-hidden="true">
        <VelocityMarquee :items="marquee" variant="outline" :speed="0.8" />
    </section>

    <!-- ============ SERVICES (rail) ============ -->
    <section v-if="services.length" class="relative py-24 md:py-36">
        <div class="container-x">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                    <p v-reveal class="eyebrow mb-6">{{ c('services.label') }}</p>
                    <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('services.title'), { text: c('services.titleAccent'), class: 'text-signal' }]" />
                </div>
                <div v-reveal:200 class="md:text-right">
                    <p class="text-body text-sm sm:text-base mb-4 max-w-xs md:ml-auto">{{ t('services.note') }}</p>
                    <Link href="/services" class="link-arrow">{{ c('services.viewAll') }}</Link>
                </div>
            </div>
            <ServiceRail :services="services" />
        </div>
    </section>

    <!-- ============ STATEMENT ============ -->
    <section class="relative bg-ink-2 border-y border-white/[0.06] overflow-hidden">
        <div class="hex-grid absolute inset-0 opacity-[0.035] pointer-events-none"></div>
        <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-signal/10 blur-[140px] pointer-events-none"></div>
        <div class="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-28 md:py-40">
            <p v-reveal class="eyebrow mb-10">{{ c('showcase.label') }}</p>
            <ScrubWords :text="statement" :highlight="statementHighlights" class="font-display normal-case tracking-[-0.02em] text-[1.9rem] sm:text-5xl lg:text-[3.4rem] leading-[1.15]" />
            <div v-reveal:200 class="mt-14 flex flex-wrap items-center gap-4">
                <Link href="/about" class="btn-signal">{{ t('nav.about') }}</Link>
                <Link href="/portfolio" class="btn-ghost">{{ c('portfolio.viewAll') }}</Link>
            </div>
        </div>
    </section>

    <!-- ============ WHY US (honeycomb) ============ -->
    <section v-if="features.length" class="relative py-24 md:py-36 overflow-hidden">
        <div class="container-x">
            <div class="max-w-3xl mb-16 lg:mb-24">
                <p v-reveal class="eyebrow mb-6">{{ c('showcase.label') }}</p>
                <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('showcase.title1'), c('showcase.title2'), { text: c('showcase.titleAccent'), class: 'text-signal' }]" />
            </div>
            <HexFeatures :features="features" />
        </div>
    </section>

    <!-- ============ PROCESS (LED line) ============ -->
    <section v-if="steps.length" class="relative bg-ink-2 border-y border-white/[0.06] py-24 md:py-36">
        <div class="container-x">
            <div class="text-center max-w-2xl mx-auto mb-20">
                <p v-reveal class="eyebrow mb-6">{{ c('process.label') }}</p>
                <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('process.title'), { text: c('process.titleAccent'), class: 'text-signal' }]" />
            </div>
            <ProcessLine :steps="steps" />
        </div>
    </section>

    <!-- ============ PORTFOLIO ============ -->
    <section v-if="portfolio.length" class="relative py-24 md:py-36 overflow-hidden">
        <div class="container-x">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                    <p v-reveal class="eyebrow mb-5">{{ c('portfolio.label') }}</p>
                    <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('portfolio.title'), { text: c('portfolio.titleAccent'), class: 'text-signal' }]" />
                </div>
                <Link v-reveal:200 href="/portfolio" class="link-arrow self-start md:self-auto">{{ c('portfolio.viewAll') }}</Link>
            </div>
            <ParallaxGallery :items="gallery" :cursor="t('portfolio.open')" @open="() => router.visit('/portfolio')" />
        </div>
    </section>

    <!-- ============ GAUGES ============ -->
    <section v-if="stats.length" class="relative bg-ink-2 border-y border-white/[0.06] py-20 md:py-24 overflow-hidden">
        <div class="hex-grid absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        <div class="container-x grid grid-cols-2 lg:grid-cols-4 gap-y-12">
            <Gauge v-for="s in stats" :key="s.label" :value="s.value" :label="s.label" />
        </div>
    </section>

    <!-- ============ TESTIMONIALS ============ -->
    <section v-if="testimonials.length" class="relative py-24 md:py-36">
        <div class="container-x">
            <div class="mb-14">
                <p v-reveal class="eyebrow mb-5">{{ c('testimonials.label') }}</p>
                <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('testimonials.title'), { text: c('testimonials.titleAccent'), class: 'text-signal' }]" />
            </div>
            <div class="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-5 px-5 scroll-px-5 md:mx-0 md:px-0">
                <figure v-for="(item, i) in testimonials" :key="item.id" v-reveal:[(i%3)*120] class="relative shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start bg-ink-3 border border-white/[0.07] clip-cut p-8 flex flex-col" :class="i === 1 ? 'md:mt-16' : ''">
                    <span class="absolute top-5 right-6 font-display text-6xl text-outline opacity-40 select-none" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                    <span class="flex gap-1 text-signal mb-6"><Icon v-for="s in Math.min(5, item.rating || 5)" :key="s" name="star" :size="14" /></span>
                    <blockquote class="text-body leading-relaxed flex-1">“{{ localized(item, 'content') }}”</blockquote>
                    <figcaption class="mt-8 pt-6 border-t border-white/[0.07]">
                        <span class="block font-display text-sm tracking-wider text-white">{{ item.client_name }}</span>
                        <span v-if="item.client_vehicle" class="block text-xs text-steel mt-1">{{ item.client_vehicle }}</span>
                    </figcaption>
                </figure>
            </div>
        </div>
    </section>

    <!-- ============ BIG CTA ============ -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden grain">
        <Photo :image="photo('ferrari-01')" alt="" sizes="100vw" reveal="none" :parallax="24" class="absolute inset-0" position="60% center" />
        <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10"></div>
        <div class="led absolute top-0 inset-x-0 opacity-50"></div>
        <div class="relative container-x py-28">
            <p v-reveal class="eyebrow mb-8">{{ c('cta.title1') }}</p>
            <MaskLines class="font-display text-5xl sm:text-7xl xl:text-[7.5rem] leading-[0.9] max-w-4xl" :lines="[{ text: c('cta.titleAccent'), class: 'text-signal' }]" />
            <p v-reveal:200 class="mt-8 text-body text-lg max-w-lg leading-relaxed">{{ c('cta.subtitle') }}</p>
            <div v-reveal:300 class="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" class="btn-signal">{{ c('cta.button') }}</Link>
                <Link href="/services" class="btn-ghost">{{ c('cta.buttonSecondary') }}</Link>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import BeforeAfter from '@/Components/BeforeAfter.vue';
import Gauge from '@/Components/Gauge.vue';
import HexFeatures from '@/Components/HexFeatures.vue';
import Icon from '@/Components/Icon.vue';
import MaskLines from '@/Components/MaskLines.vue';
import ParallaxGallery from '@/Components/ParallaxGallery.vue';
import Photo from '@/Components/Photo.vue';
import ProcessLine from '@/Components/ProcessLine.vue';
import ScrubWords from '@/Components/ScrubWords.vue';
import ServiceRail from '@/Components/ServiceRail.vue';
import Sparks from '@/Components/Sparks.vue';
import VelocityMarquee from '@/Components/VelocityMarquee.vue';
import { useI18n } from '@/i18n.js';
import { imageFor, photo, portfolioPhoto } from '@/lib/img.js';
import { whenReady } from '@/lib/intro';

defineOptions({ layout: MainLayout });

const props = defineProps({
    services: { type: Array, default: () => [] },
    portfolio: { type: Array, default: () => [] },
    testimonials: { type: Array, default: () => [] },
});

const { t, c, localized } = useI18n();

const marquee = computed(() => t('marquee'));
const stats = computed(() => ['cars', 'clients', 'years', 'rating'].map((k) => ({ value: c(`stats.${k}.value`), label: c(`stats.${k}.label`) })).filter((s) => s.value));

const featurePhotos = ['audi-black-side', 'bmw-interior-04', 'gallery-02', 'red-audi-02'];
const featureIcons = ['award', 'droplet', 'shield', 'calendar'];
const features = computed(() => [1, 2, 3, 4].map((n, i) => ({ title: c(`showcase.feature${n}.title`), text: c(`showcase.feature${n}.description`), icon: featureIcons[i], image: featurePhotos[i] })).filter((f) => f.title));
const steps = computed(() => [1, 2, 3, 4].map((n) => ({ title: c(`process.step${n}.title`), description: c(`process.step${n}.description`) })).filter((s) => s.title));

const statement = computed(() => c('aboutPage.storyP1') || c('hero.subtitle'));
const statementHighlights = ['mdetailing', 'детално', 'керамичка', 'перфекција', 'perfection', 'premier', 'ceramic', 'best', 'најдобро'];

const gallery = computed(() => props.portfolio.map((item) => ({ image: imageFor(item.after_image || item.before_image, portfolioPhoto(item)), alt: localized(item, 'title'), label: localized(item, 'title'), category: item.category })));

let cancel = () => {};
onMounted(() => { cancel = whenReady(() => document.querySelectorAll('.hero-fade').forEach((el) => el.classList.add('is-in'))); });
onBeforeUnmount(() => cancel());
</script>

<style scoped>
.hero-fade { opacity: 0; transform: translateY(24px); transition: opacity 1s var(--ease-forge), transform 1.2s var(--ease-forge); transition-delay: var(--d, 0ms); }
.hero-fade.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .hero-fade { opacity: 1; transform: none; transition: none; } }
</style>
