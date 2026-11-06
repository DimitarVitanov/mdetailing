<template>
    <PageHero :label="c('servicesPage.label')" :title="c('servicesPage.title')" :accent="c('servicesPage.titleAccent')"
              :subtitle="c('servicesPage.subtitle')" image="audi-black-front-2"
              :crumbs="[{ href: '/', label: t('footer.home') }, { href: '/services', label: t('nav.services') }]" />

    <section class="relative pb-24 md:pb-32">
        <div class="container-x">
            <div class="flex flex-col gap-3 border-y border-white/[0.06] py-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
                <p class="flex items-center gap-2"><Icon name="sparkles" :size="16" class="text-signal" /> {{ t('services.note') }}</p>
                <p>{{ services.length }} {{ t('nav.services').toLowerCase() }}</p>
            </div>

            <h2 class="sr-only">{{ c('servicesPage.titleAccent') }}</h2>
            <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="(service, i) in services" :key="service.id" v-reveal:[(i%3)*90]>
                    <ServiceCard :service="service" :index="i" />
                </div>
            </div>
        </div>
    </section>

    <CtaBand :title="c('servicesPage.ctaTitle')" :text="c('servicesPage.ctaText')" :button="c('servicesPage.ctaButton')"
             :phone="c('footer.phone')" image="red-audi-01" />
</template>

<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import CtaBand from '@/Components/CtaBand.vue';
import Icon from '@/Components/Icon.vue';
import PageHero from '@/Components/PageHero.vue';
import ServiceCard from '@/Components/ServiceCard.vue';
import { useI18n } from '@/i18n.js';

defineOptions({ layout: MainLayout });

defineProps({
    services: { type: Array, default: () => [] },
});

const { t, c } = useI18n();
</script>
