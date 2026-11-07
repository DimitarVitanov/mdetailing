<template>
    <PageHero :eyebrow="c('aboutPage.label')" :lines="[c('aboutPage.title'), { text: c('aboutPage.titleAccent'), class: 'text-signal' }]" image="red-audi-04" position="center 60%" :crumb="t('nav.about')">
        {{ c('aboutPage.subtitle') }}
    </PageHero>

    <!-- ============ STATEMENT ============ -->
    <section class="relative bg-ink-2 border-b border-white/[0.06] overflow-hidden">
        <div class="hex-grid absolute inset-0 opacity-[0.035] pointer-events-none"></div>
        <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-signal/10 blur-[140px] pointer-events-none"></div>
        <div class="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-28 md:py-40">
            <p v-reveal class="eyebrow mb-10">{{ c('aboutPage.storyTitle') }} {{ c('aboutPage.storyTitleAccent') }}</p>
            <ScrubWords :text="c('aboutPage.storyP1')" :highlight="highlights" class="font-display normal-case tracking-[-0.02em] text-[1.9rem] sm:text-5xl lg:text-[3.4rem] leading-[1.15]" />
        </div>
    </section>

    <!-- ============ STORY ============ -->
    <section class="relative container-x py-24 md:py-36 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div class="relative h-[520px] sm:h-[640px]">
            <Photo :image="photo('red-audi-front')" alt="" sizes="(min-width: 1024px) 30vw, 70vw" :parallax="14" class="absolute left-0 top-0 w-[68%] h-[88%] clip-cut [--cut:30px]" />
            <Photo :image="photo('audi-interior-detail')" alt="" sizes="(min-width: 1024px) 22vw, 50vw" reveal="side" :parallax="10" class="absolute right-0 bottom-0 w-[52%] h-[42%] clip-cut border-4 border-ink" />
            <div class="led-v absolute right-[24%] top-[6%] h-[30%]"></div>
            <div v-if="c('stats.years.value')" v-reveal:300 class="absolute right-[6%] top-[12%] bg-signal text-ink px-6 py-5 clip-cut-sm">
                <p class="font-display text-4xl leading-none"><Odometer :value="c('stats.years.value')" /></p>
                <p class="text-[10px] uppercase tracking-[0.25em] mt-2">{{ c('stats.years.label') }}</p>
            </div>
        </div>
        <div>
            <p v-reveal class="eyebrow mb-6">{{ c('aboutPage.label') }}</p>
            <MaskLines class="font-display text-4xl sm:text-5xl xl:text-6xl leading-[0.95] mb-8" :lines="[c('aboutPage.storyTitle'), { text: c('aboutPage.storyTitleAccent'), class: 'text-signal' }]" />
            <p v-reveal:150 class="text-body text-lg leading-relaxed mb-6">{{ c('aboutPage.storyP2') }}</p>
            <p v-reveal:200 class="text-body leading-relaxed mb-10">{{ c('aboutPage.storyP3') }}</p>
            <Link v-reveal:300 href="/contact" class="btn-signal">{{ t('nav.bookNow') }}</Link>
        </div>
    </section>

    <!-- ============ VALUES (honeycomb) ============ -->
    <section v-if="values.length" class="relative bg-ink-2 border-y border-white/[0.06] py-24 md:py-36 overflow-hidden">
        <div class="container-x">
            <div class="max-w-3xl mb-16 lg:mb-24">
                <p v-reveal class="eyebrow mb-6">{{ c('aboutPage.valuesLabel') }}</p>
                <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('aboutPage.valuesTitle')]" />
            </div>
            <HexFeatures :features="values" />
        </div>
    </section>

    <!-- ============ REVIEWS ============ -->
    <section v-if="testimonials.length" class="relative py-24 md:py-36">
        <div class="container-x">
            <div class="mb-14">
                <p v-reveal class="eyebrow mb-5">{{ c('aboutPage.testimonialsLabel') }}</p>
                <MaskLines class="font-display text-4xl sm:text-6xl leading-[0.95]" :lines="[c('aboutPage.testimonialsTitle')]" />
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <figure v-for="(item, i) in testimonials" :key="item.id" v-reveal:[(i%3)*120] class="relative bg-ink-3 border border-white/[0.07] clip-cut p-8 flex flex-col">
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
</template>

<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import HexFeatures from '@/Components/HexFeatures.vue';
import Icon from '@/Components/Icon.vue';
import MaskLines from '@/Components/MaskLines.vue';
import Odometer from '@/Components/Odometer.vue';
import PageHero from '@/Components/PageHero.vue';
import Photo from '@/Components/Photo.vue';
import ScrubWords from '@/Components/ScrubWords.vue';
import { useI18n } from '@/i18n.js';
import { photo } from '@/lib/img.js';

defineOptions({ layout: MainLayout });
defineProps({ testimonials: { type: Array, default: () => [] } });

const { t, c, localized } = useI18n();
const highlights = ['mdetailing', 'best', 'premier', 'најдобро', 'премиер', 'перфекција', 'perfection'];
const valuePhotos = ['gallery-04', 'bmw-interior-02', 'red-audi-01'];
const valueIcons = ['award', 'shield', 'zap'];
const values = computed(() => [1, 2, 3].map((n, i) => ({ title: c(`aboutPage.value${n}.title`), text: c(`aboutPage.value${n}.description`), icon: valueIcons[i], image: valuePhotos[i] })).filter((v) => v.title));
</script>
