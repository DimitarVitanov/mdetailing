<template>
    <MainLayout>
        <Head :title="t('aboutPage.label')" />

        <!-- Hero -->
        <section class="pt-32 pb-16 bg-gradient-to-b from-black to-dark relative">
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.3) 0%, transparent 50%);"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <span class="text-gold text-sm font-semibold tracking-widest uppercase">{{ c('aboutPage.label') }}</span>
                <h1 class="text-4xl lg:text-6xl font-black mt-3 mb-4">{{ c('aboutPage.title') }} <span class="text-gold">{{ c('aboutPage.titleAccent') }}</span></h1>
                <p class="text-gray-light text-lg max-w-2xl mx-auto">{{ c('aboutPage.subtitle') }}</p>
            </div>
        </section>

        <!-- Story -->
        <section class="py-20 bg-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 class="text-3xl lg:text-4xl font-bold mb-6">{{ c('aboutPage.storyTitle') }} <span class="text-gold">{{ c('aboutPage.storyTitleAccent') }}</span></h2>
                        <div class="space-y-4 text-gray-light leading-relaxed">
                            <p>{{ c('aboutPage.storyP1') }}</p>
                            <p>{{ c('aboutPage.storyP2') }}</p>
                            <p>{{ c('aboutPage.storyP3') }}</p>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="aspect-square rounded-2xl overflow-hidden border border-white/5">
                            <img src="/img/webp/red-audi-front.webp" alt="MDetailing Premium Car Care Studio" class="w-full h-full object-cover" />
                        </div>
                        <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 rounded-2xl -z-10"></div>
                        <div class="absolute -top-6 -left-6 w-32 h-32 bg-gold/5 rounded-2xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Values -->
        <section class="py-20 bg-darker">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <span class="text-gold text-sm font-semibold tracking-widest uppercase">{{ c('aboutPage.valuesLabel') }}</span>
                    <h2 class="text-3xl lg:text-4xl font-bold mt-3">{{ c('aboutPage.valuesTitle') }}</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="(value, index) in translatedValues" :key="index"
                         class="bg-gray-dark/50 border border-white/5 rounded-2xl p-8 text-center hover:border-gold/20 transition-all duration-300 hover:-translate-y-1">
                        <div class="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="valueIcons[index]"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">{{ value.title }}</h3>
                        <p class="text-gray-light text-sm leading-relaxed">{{ value.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section v-if="testimonials.length" class="py-20 bg-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <span class="text-gold text-sm font-semibold tracking-widest uppercase">{{ c('aboutPage.testimonialsLabel') }}</span>
                    <h2 class="text-3xl lg:text-4xl font-bold mt-3">{{ c('aboutPage.testimonialsTitle') }}</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div v-for="item in testimonials" :key="item.id"
                         class="bg-gray-dark/50 border border-white/5 rounded-2xl p-8 hover:border-gold/20 transition-all duration-300">
                        <div class="flex space-x-1 mb-4">
                            <svg v-for="star in item.rating" :key="star" class="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        </div>
                        <p class="text-gray-light text-sm leading-relaxed mb-6 italic">"{{ localized(item, 'content') }}"</p>
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-semibold text-sm">
                                {{ item.client_name.charAt(0) }}
                            </div>
                            <div>
                                <p class="font-semibold text-white text-sm">{{ item.client_name }}</p>
                                <p v-if="item.client_vehicle" class="text-gray-light text-xs">{{ item.client_vehicle }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import { useI18n } from '@/i18n.js';

const { t, c, localized } = useI18n();

defineProps({ testimonials: Array });

const valueIcons = [
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'M13 10V3L4 14h7v7l9-11h-7z',
];

const translatedValues = computed(() => [
    { title: c('aboutPage.value1.title'), description: c('aboutPage.value1.description') },
    { title: c('aboutPage.value2.title'), description: c('aboutPage.value2.description') },
    { title: c('aboutPage.value3.title'), description: c('aboutPage.value3.description') },
]);
</script>
