<template>
    <PageHero :label="c('aboutPage.label')" :title="c('aboutPage.title')" :accent="c('aboutPage.titleAccent')"
              :subtitle="c('aboutPage.subtitle')" image="red-audi-04"
              :crumbs="[{ href: '/', label: t('footer.home') }, { href: '/about', label: t('nav.about') }]" />

    <!-- ═════════ Story ═════════ -->
    <section class="pb-24 md:pb-32">
        <div class="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div v-reveal>
                <h2 class="display text-[clamp(1.85rem,4.2vw,3.2rem)]">
                    <span class="chrome">{{ c('aboutPage.storyTitle') }}</span>{{ ' ' }}<span class="signal-text">{{ c('aboutPage.storyTitleAccent') }}</span>
                </h2>
                <div class="mt-8 space-y-5 text-base leading-relaxed text-white/65 md:text-[17px]">
                    <p v-for="key in ['storyP1', 'storyP2', 'storyP3']" :key="key" v-show="c(`aboutPage.${key}`)">{{ c(`aboutPage.${key}`) }}</p>
                </div>
                <div class="mt-10 flex flex-col gap-3 sm:flex-row">
                    <Link href="/contact" class="btn btn-signal">{{ t('nav.bookNow') }} <Icon name="arrow-right" :size="18" class="btn-arrow" /></Link>
                    <Link href="/portfolio" prefetch class="btn btn-ghost">{{ c('portfolio.viewAll') }}</Link>
                </div>
            </div>

            <div v-reveal="'scale'" class="relative pb-10 pl-10 sm:pb-16 sm:pl-16">
                <div class="aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/[0.07]">
                    <img v-bind="photo('red-audi-front')" sizes="(min-width: 1024px) 40vw, 90vw" :alt="c('aboutPage.storyTitle')" loading="lazy" decoding="async" class="h-full w-full object-cover" />
                </div>
                <div class="absolute bottom-0 left-0 w-[46%] overflow-hidden rounded-2xl border-4 border-ink shadow-2xl">
                    <img v-bind="photo('audi-interior-detail')" sizes="(min-width: 1024px) 18vw, 40vw" alt="" loading="lazy" decoding="async" class="aspect-square h-full w-full object-cover" />
                </div>
                <div v-if="c('stats.years.value')" class="glass absolute right-4 top-6 rounded-2xl px-5 py-4 text-center shadow-2xl">
                    <div class="display signal-text text-3xl">{{ c('stats.years.value') }}</div>
                    <div class="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">{{ c('stats.years.label') }}</div>
                </div>
            </div>
        </div>
    </section>

    <StatsBand />

    <!-- ═════════ Values ═════════ -->
    <section class="relative overflow-hidden py-24 md:py-32">
        <div class="hex-grid pointer-events-none absolute inset-0 opacity-50"></div>
        <div class="container-x relative">
            <div v-reveal>
                <SectionHeading :label="c('aboutPage.valuesLabel')" :title="c('aboutPage.valuesTitle')" center />
            </div>
            <div class="mt-14 grid gap-5 md:grid-cols-3">
                <div v-for="(value, i) in values" :key="i" v-reveal:[i*100] class="card group p-8 transition-colors duration-500 hover:border-signal/40">
                    <span class="grid h-14 w-14 place-items-center rounded-2xl bg-signal/10 text-signal transition-colors duration-500 group-hover:bg-signal group-hover:text-ink">
                        <Icon :name="value.icon" :size="26" />
                    </span>
                    <h3 class="mt-7 font-display text-xl font-semibold tracking-tight text-white">{{ value.title }}</h3>
                    <p class="mt-3 text-sm leading-relaxed text-white/60">{{ value.description }}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ═════════ Reviews ═════════ -->
    <section v-if="testimonials.length" class="border-t border-white/[0.06] bg-ink-2 py-24 md:py-32">
        <div class="container-x">
            <div v-reveal>
                <SectionHeading :label="c('aboutPage.testimonialsLabel')" :title="c('aboutPage.testimonialsTitle')" />
            </div>
            <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div v-for="(item, i) in testimonials" :key="item.id" v-reveal:[(i%3)*90]>
                    <TestimonialCard :testimonial="item" />
                </div>
            </div>
        </div>
    </section>

    <CtaBand :title="c('cta.title1')" :accent="c('cta.titleAccent')" :text="c('cta.subtitle')"
             :button="c('cta.button')" :phone="c('footer.phone')" image="gallery-05" />
</template>

<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import CtaBand from '@/Components/CtaBand.vue';
import Icon from '@/Components/Icon.vue';
import PageHero from '@/Components/PageHero.vue';
import SectionHeading from '@/Components/SectionHeading.vue';
import StatsBand from '@/Components/StatsBand.vue';
import TestimonialCard from '@/Components/TestimonialCard.vue';
import { useI18n } from '@/i18n.js';
import { photo } from '@/lib/img.js';

defineOptions({ layout: MainLayout });

defineProps({ testimonials: { type: Array, default: () => [] } });

const { t, c } = useI18n();

const values = computed(() =>
    ['award', 'shield', 'zap']
        .map((icon, i) => ({ icon, title: c(`aboutPage.value${i + 1}.title`), description: c(`aboutPage.value${i + 1}.description`) }))
        .filter((value) => value.title),
);
</script>
