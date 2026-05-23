<template>
    <MainLayout>
        <Head :title="service.name" />

        <section class="pt-32 pb-20 bg-gradient-to-b from-black to-dark">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/services" class="inline-flex items-center space-x-2 text-gold hover:text-gold-light transition-colors mb-8">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    <span>{{ t('serviceDetailPage.backToServices') }}</span>
                </Link>

                <div class="bg-gray-dark/50 border border-white/5 rounded-2xl overflow-hidden">
                    <div class="h-64 md:h-80 bg-gradient-to-br from-gray-dark to-gray-medium relative">
                        <img v-if="service.image" :src="'/storage/' + service.image" :alt="service.name" class="w-full h-full object-cover"/>
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <svg class="w-24 h-24 text-white/5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                        </div>
                    </div>

                    <div class="p-8 md:p-12">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <h1 class="text-3xl lg:text-4xl font-bold mb-2">{{ localized(service, 'name') }}</h1>
                                <p class="text-gray-light">{{ localized(service, 'short_description') }}</p>
                            </div>
                            <div class="text-right flex-shrink-0 ml-8">
                                <div class="text-gold text-3xl font-bold">{{ price(service.price_from) }}</div>
                                <div v-if="service.price_to" class="text-gray-light text-sm">{{ t('serviceDetailPage.upTo') }} {{ price(service.price_to) }}</div>
                                <div v-if="service.duration" class="text-gray-light text-sm mt-1">{{ service.duration }}</div>
                            </div>
                        </div>

                        <div class="prose prose-invert max-w-none text-gray-light leading-relaxed" v-html="localized(service, 'description')"></div>

                        <div class="mt-10 pt-8 border-t border-white/5">
                            <Link href="/contact" class="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold rounded-xl hover:shadow-2xl hover:shadow-gold/25 transition-all duration-300">
                                <span>{{ t('serviceDetailPage.bookThis') }}</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { Link, Head } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import { useI18n } from '@/i18n.js';

const { t, localized, price } = useI18n();

defineProps({
    service: Object,
});
</script>
