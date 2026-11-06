<template>
    <!-- ═════════ Hero ═════════ -->
    <section class="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-36 md:items-center md:pb-24">
        <div class="absolute inset-0 -z-10">
            <img src="/img/opt/hero-studio-1600.webp" srcset="/img/opt/hero-studio-640.webp 640w, /img/opt/hero-studio-1024.webp 1024w, /img/opt/hero-studio-1600.webp 1600w, /img/opt/hero-studio-2000.webp 2000w"
                 sizes="100vw" :alt="c('hero.badge')" fetchpriority="high" decoding="async"
                 class="h-full w-full object-cover object-[50%_40%]" />
            <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent"></div>
        </div>

        <div class="container-x">
            <div class="max-w-4xl">
                <span class="glass rise inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
                    <span class="led-pulse h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]"></span>
                    {{ c('hero.badge') }}
                </span>

                <h1 class="display slide mt-7 text-[clamp(2.5rem,6.8vw,6rem)]">
                    <span class="chrome block">{{ c('hero.title1') }}</span>
                    <span class="block"><span class="chrome">{{ c('hero.title2') }}</span>{{ ' ' }}<span class="signal-text">{{ c('hero.title3') }}</span></span>
                </h1>

                <p class="slide mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg" style="--d: 60ms">{{ c('hero.subtitle') }}</p>

                <div class="rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style="--d: 270ms">
                    <Link href="/contact" class="btn btn-signal">
                        {{ c('hero.cta') }} <Icon name="arrow-right" :size="18" class="btn-arrow" />
                    </Link>
                    <Link href="/services" prefetch class="btn btn-ghost">{{ c('hero.ctaSecondary') }}</Link>
                    <a v-if="phone" :href="telHref(phone)" class="group inline-flex items-center justify-center gap-3 px-2 py-3 text-sm font-medium text-white/80 transition-colors hover:text-signal sm:ml-3">
                        <span class="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-signal"><Icon name="phone" :size="15" /></span>
                        {{ phone }}
                    </a>
                </div>
            </div>
        </div>

        <div class="pointer-events-none absolute bottom-8 right-8 hidden flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55 md:flex">
            <span class="[writing-mode:vertical-rl]">{{ t('hero.scroll') }}</span>
            <span class="scroll-line block h-14 w-px bg-gradient-to-b from-signal to-transparent"></span>
        </div>
    </section>

    <!-- ═════════ Stats ═════════ -->
    <StatsBand />

    <!-- ═════════ Ticker ═════════ -->
    <div class="overflow-hidden border-b border-white/[0.06] py-6" aria-hidden="true">
        <div class="marquee flex w-max items-center">
            <template v-for="copy in 2" :key="copy">
                <span v-for="item in marqueeItems" :key="copy + item" class="flex items-center">
                    <span class="px-8 font-display text-lg font-medium tracking-tight text-white/80 md:text-2xl">{{ item }}</span>
                    <span class="h-2.5 w-2.5 bg-signal [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]"></span>
                </span>
            </template>
        </div>
    </div>

    <!-- ═════════ Services ═════════ -->
    <section v-if="services.length" class="relative py-24 md:py-32">
        <div class="container-x">
            <div v-reveal class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <SectionHeading :label="c('services.label')" :title="c('services.title')" :accent="c('services.titleAccent')" />
                <div class="flex flex-col gap-3 md:items-end md:text-right">
                    <p class="max-w-xs text-sm text-white/50">{{ t('services.note') }}</p>
                    <Link href="/services" prefetch class="group inline-flex items-center gap-2 text-sm font-semibold text-signal">
                        {{ c('services.viewAll', t('services.viewAll')) }}
                        <Icon name="arrow-right" :size="16" class="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="(service, i) in services" :key="service.id" v-reveal:[(i%3)*90]>
                    <ServiceCard :service="service" :index="i" />
                </div>
                <div v-if="services.length % 3" v-reveal class="sm:col-span-2 lg:col-span-1" :class="services.length % 3 === 1 ? 'lg:col-span-2' : ''">
                    <Link href="/contact" class="group relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden rounded-3xl border border-signal/25 bg-gradient-to-br from-signal/[0.12] via-ink-2 to-ink-2 p-8 transition-colors hover:border-signal/60">
                        <div class="hex-grid pointer-events-none absolute inset-0 opacity-70"></div>
                        <Icon name="sparkles" :size="30" class="relative text-signal" />
                        <div class="relative">
                            <h3 class="font-display text-xl font-semibold tracking-tight text-white">{{ c('servicesPage.ctaTitle') }}</h3>
                            <p class="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{{ c('servicesPage.ctaText') }}</p>
                            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal">
                                {{ c('servicesPage.ctaButton') }} <Icon name="arrow-right" :size="16" class="transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </section>

    <!-- ═════════ Why us ═════════ -->
    <section class="relative overflow-hidden bg-ink-2 py-24 md:py-32">
        <div class="hex-grid hex-fade-2 pointer-events-none absolute -right-40 top-0 h-full w-2/3 opacity-60"></div>
        <div class="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div v-reveal="'scale'" class="relative">
                <div class="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                    <img v-bind="photo('audi-black-front')" sizes="(min-width: 1024px) 45vw, 100vw" :alt="c('showcase.label')" loading="lazy" decoding="async"
                         class="h-full w-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"></div>
                </div>
                <div v-if="rating.value" class="glass absolute -bottom-6 left-6 flex items-center gap-4 rounded-2xl px-5 py-4 shadow-2xl md:left-10">
                    <span class="display text-3xl text-white">{{ rating.value }}</span>
                    <span>
                        <span class="flex gap-0.5 text-signal"><Icon v-for="s in 5" :key="s" name="star" :size="13" /></span>
                        <span class="mt-1 block text-xs text-white/60">{{ rating.label }}</span>
                    </span>
                </div>
            </div>

            <div>
                <div v-reveal>
                    <SectionHeading :label="c('showcase.label')" :title="`${c('showcase.title1')} ${c('showcase.title2')}`" :accent="c('showcase.titleAccent')" />
                </div>
                <ol class="mt-10">
                    <li v-for="(feature, i) in features" :key="i" v-reveal:[i*90] class="group flex gap-6 border-t border-white/[0.08] py-6 last:border-b">
                        <span class="font-display text-sm font-medium text-signal">{{ String(i + 1).padStart(2, '0') }}</span>
                        <div>
                            <h3 class="text-lg font-semibold text-white">{{ feature.title }}</h3>
                            <p class="mt-2 text-sm leading-relaxed text-white/60">{{ feature.description }}</p>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
    </section>

    <!-- ═════════ Process ═════════ -->
    <section class="relative py-24 md:py-32">
        <div class="container-x">
            <div v-reveal>
                <SectionHeading :label="c('process.label')" :title="c('process.title')" :accent="c('process.titleAccent')" center />
            </div>

            <div class="relative mt-16">
                <div class="led absolute inset-x-[12%] top-8 hidden opacity-40 lg:block"></div>
                <ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <li v-for="(step, i) in steps" :key="i" v-reveal:[i*110] class="card relative p-7 lg:border-0 lg:bg-none lg:p-2 lg:text-center">
                        <div class="relative mx-0 grid h-16 w-16 place-items-center lg:mx-auto">
                            <span class="absolute inset-0 bg-signal/15 [clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0_50%)]"></span>
                            <span class="absolute inset-[2px] bg-ink [clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0_50%)]"></span>
                            <Icon :name="step.icon" :size="24" class="relative text-signal" />
                        </div>
                        <span class="mt-6 block font-display text-xs tracking-widest text-white/55">{{ String(i + 1).padStart(2, '0') }}</span>
                        <h3 class="mt-2 font-display text-lg font-semibold tracking-tight text-white">{{ step.title }}</h3>
                        <p class="mt-3 text-sm leading-relaxed text-white/60">{{ step.description }}</p>
                    </li>
                </ol>
            </div>
        </div>
    </section>

    <!-- ═════════ Portfolio ═════════ -->
    <section v-if="portfolio.length" class="relative border-t border-white/[0.06] bg-ink-2 py-24 md:py-32">
        <div class="container-x">
            <div v-reveal class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <SectionHeading :label="c('portfolio.label')" :title="c('portfolio.title')" :accent="c('portfolio.titleAccent')" />
                <Link href="/portfolio" prefetch class="btn btn-ghost self-start md:self-auto">
                    {{ c('portfolio.viewAll') }} <Icon name="arrow-right" :size="16" class="btn-arrow" />
                </Link>
            </div>

            <div class="mt-14 grid grid-flow-dense auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] md:gap-4 lg:auto-rows-[16.5rem] lg:grid-cols-4">
                <Link v-for="(item, i) in portfolio" :key="item.id" href="/portfolio" v-reveal:[(i%3)*80]="'scale'"
                      class="group relative overflow-hidden rounded-2xl bg-ink-3 md:rounded-3xl" :class="bento[i % bento.length]">
                    <img v-bind="imageFor(item.after_image || item.before_image, portfolioPhoto(item))"
                         :sizes="i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'"
                         :alt="localized(item, 'title')" loading="lazy" decoding="async"
                         class="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.07]" />
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div class="absolute inset-x-0 bottom-0 p-4 md:p-6">
                        <span v-if="item.category" class="mb-2 inline-block rounded-full bg-signal/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">{{ item.category }}</span>
                        <h3 class="line-clamp-2 text-sm font-semibold text-white md:text-lg">{{ localized(item, 'title') }}</h3>
                    </div>
                    <span class="absolute right-4 top-4 grid h-10 w-10 scale-75 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <Icon name="arrow-up-right" :size="17" />
                    </span>
                </Link>
            </div>
        </div>
    </section>

    <!-- ═════════ Testimonials ═════════ -->
    <section v-if="testimonials.length" class="relative overflow-hidden py-24 md:py-32">
        <div class="glow absolute left-1/2 -top-24 h-[30rem] w-[70rem] max-w-[200%] -translate-x-1/2 opacity-60"></div>
        <div class="container-x relative">
            <div v-reveal class="flex items-end justify-between gap-6">
                <SectionHeading :label="c('testimonials.label')" :title="c('testimonials.title')" :accent="c('testimonials.titleAccent')" />
                <div v-if="testimonials.length > 1" class="hidden gap-2 md:flex">
                    <button type="button" @click="slide(-1)" class="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-signal hover:text-signal" :aria-label="t('testimonials.prev')">
                        <Icon name="arrow-left" :size="18" />
                    </button>
                    <button type="button" @click="slide(1)" class="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-signal hover:text-signal" :aria-label="t('testimonials.next')">
                        <Icon name="arrow-right" :size="18" />
                    </button>
                </div>
            </div>

            <!-- scroll-padding matches the side padding, so the first card already sits on its snap point
                 (otherwise the browser auto-scrolls the track on load, which also cuts Chrome's LCP short). -->
            <div ref="track" class="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 xl:mx-0 xl:scroll-px-0 xl:px-0">
                <div v-for="item in testimonials" :key="item.id" class="w-[86%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]">
                    <TestimonialCard :testimonial="item" />
                </div>
            </div>
        </div>
    </section>

    <CtaBand :title="c('cta.title1')" :accent="c('cta.titleAccent')" :text="c('cta.subtitle')"
             :button="c('cta.button')" :secondary="c('cta.buttonSecondary')" image="ferrari-01" />
</template>

<script setup>
import { computed, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import CtaBand from '@/Components/CtaBand.vue';
import Icon from '@/Components/Icon.vue';
import SectionHeading from '@/Components/SectionHeading.vue';
import ServiceCard from '@/Components/ServiceCard.vue';
import StatsBand from '@/Components/StatsBand.vue';
import TestimonialCard from '@/Components/TestimonialCard.vue';
import { telHref, useI18n } from '@/i18n.js';
import { imageFor, photo, portfolioPhoto } from '@/lib/img.js';

defineOptions({ layout: MainLayout });

defineProps({
    services: { type: Array, default: () => [] },
    portfolio: { type: Array, default: () => [] },
    testimonials: { type: Array, default: () => [] },
});

const { t, c, localized } = useI18n();

const phone = computed(() => c('footer.phone'));
const marqueeItems = computed(() => t('marquee'));

const rating = computed(() => ({ value: c('stats.rating.value'), label: c('stats.rating.label') }));

const features = computed(() =>
    [1, 2, 3, 4]
        .map((n) => ({ title: c(`showcase.feature${n}.title`), description: c(`showcase.feature${n}.description`) }))
        .filter((feature) => feature.title),
);

const steps = computed(() =>
    ['eye', 'droplet', 'sparkles', 'shield'].map((icon, i) => ({
        icon,
        title: c(`process.step${i + 1}.title`),
        description: c(`process.step${i + 1}.description`),
    })),
);

// Bento layout for up to six portfolio photos (4 columns on desktop, 2 on phones).
const bento = ['col-span-2 row-span-2', '', 'row-span-2', '', 'col-span-2', 'col-span-2'];

const track = ref(null);
function slide(direction) {
    const el = track.value;
    if (!el) return;
    const card = el.firstElementChild;
    el.scrollBy({ left: direction * ((card?.offsetWidth ?? el.clientWidth) + 16), behavior: 'smooth' });
}
</script>

<style scoped>
.scroll-line {
    animation: scroll-line 2.2s ease-in-out infinite;
    transform-origin: top;
}
@keyframes scroll-line {
    0% { transform: scaleY(0); opacity: 0; }
    40% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
}
</style>
