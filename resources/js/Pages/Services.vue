<template>
    <PageHero :eyebrow="c('servicesPage.label')" :lines="[c('servicesPage.title'), { text: c('servicesPage.titleAccent'), class: 'text-signal' }]" image="audi-black-front-2" :crumb="t('nav.services')">
        {{ c('servicesPage.subtitle') }}
    </PageHero>

    <section class="relative py-16 md:py-28">
        <div class="container-x">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-4 text-sm text-body">
                <p v-reveal class="flex items-center gap-3"><Icon name="sparkles" :size="16" class="text-signal" /> {{ t('services.note') }}</p>
                <p v-reveal:100 class="font-display text-[10px] tracking-[0.25em] text-steel">{{ String(services.length).padStart(2, '0') }} {{ t('nav.services') }}</p>
            </div>
            <ServiceRail :services="services" />
        </div>
    </section>

    <section class="relative py-24 md:py-32 overflow-hidden border-t border-white/[0.06] bg-ink-2">
        <div class="absolute inset-0 opacity-60"><Sparks :density="0.6" /></div>
        <div class="relative container-x grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <MaskLines tag="h2" class="font-display text-4xl sm:text-6xl xl:text-7xl leading-[0.92]" :lines="[c('servicesPage.ctaTitle')]" />
            <div v-reveal:150>
                <p class="text-body text-lg leading-relaxed mb-8">{{ c('servicesPage.ctaText') }}</p>
                <div class="flex flex-wrap gap-4">
                    <Link href="/contact" class="btn-signal">{{ c('servicesPage.ctaButton') }}</Link>
                    <a v-if="phone" :href="telHref(phone)" class="btn-ghost"><Icon name="phone" :size="15" /> {{ phone }}</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import Icon from '@/Components/Icon.vue';
import MaskLines from '@/Components/MaskLines.vue';
import PageHero from '@/Components/PageHero.vue';
import ServiceRail from '@/Components/ServiceRail.vue';
import Sparks from '@/Components/Sparks.vue';
import { telHref, useI18n } from '@/i18n.js';

defineOptions({ layout: MainLayout });
defineProps({ services: { type: Array, default: () => [] } });

const { t, c } = useI18n();
const phone = computed(() => c('footer.phone'));
</script>
