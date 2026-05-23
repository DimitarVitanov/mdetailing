<template>
    <MainLayout>
        <Head :title="c('servicesPage.titleAccent')" />

        <!-- Hero -->
        <section class="relative pt-28 pb-12 md:pt-32 md:pb-20 overflow-hidden">
            <!-- Background -->
            <div class="absolute inset-0 bg-gradient-to-b from-black via-dark to-darker"></div>
            <div class="absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(circle at 30% 20%, rgba(212,175,55,0.5) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(212,175,55,0.3) 0%, transparent 40%);"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[120px]"></div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold tracking-[0.2em] uppercase mb-6">
                    <span class="w-1.5 h-1.5 bg-gold rounded-full mr-2 animate-pulse"></span>
                    {{ c('servicesPage.label') }}
                </span>
                <h1 class="text-3xl sm:text-5xl lg:text-7xl font-extrabold mt-3 mb-4 md:mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
                    {{ c('servicesPage.title') }} <span class="text-gradient-gold italic">{{ c('servicesPage.titleAccent') }}</span>
                </h1>
                <p class="text-white/50 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">{{ c('servicesPage.subtitle') }}</p>
            </div>
        </section>

        <!-- Services Grid -->
        <section class="py-12 md:py-24 bg-darker relative">
            <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23d4af37&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <!-- Featured service (first one, large card) -->
                <div v-if="services.length" class="mb-8 md:mb-16">
                    <div class="group relative bg-surface border border-white/[0.06] rounded-2xl md:rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-700 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                        <div class="grid grid-cols-1 lg:grid-cols-2">
                            <div class="h-44 md:h-64 lg:h-full lg:min-h-[400px] relative overflow-hidden">
                                <img v-if="services[0].image" :src="'/storage/' + services[0].image" :alt="localized(services[0], 'name')" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"/>
                                <div v-else class="w-full h-full bg-gradient-to-br from-gold/[0.08] via-surface to-surface flex items-center justify-center relative">
                                    <!-- Decorative hex pattern -->
                                    <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2249%22 viewBox=%220 0 28 49%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23d4af37%22 fill-opacity=%221%22%3E%3Cpath d=%22M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
                                    <div class="relative z-10 flex flex-col items-center">
                                        <div class="w-24 h-24 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                            <svg class="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="serviceIcons[0]"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-surface/80 hidden lg:block"></div>
                                <div class="absolute inset-0 bg-gradient-to-t from-surface to-transparent lg:hidden"></div>
                                <div v-if="services[0].is_featured" class="absolute top-6 left-6 inline-flex items-center px-3 py-1.5 bg-gold/90 text-dark text-[10px] font-black rounded-full uppercase tracking-wider">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    {{ t('servicesPage.popular') }}
                                </div>
                            </div>
                            <div class="p-6 md:p-10 lg:p-14 flex flex-col justify-center">
                                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 group-hover:text-gold transition-colors duration-300" style="font-family: 'Playfair Display', serif;">{{ localized(services[0], 'name') }}</h2>
                                <p class="text-white/50 text-sm md:text-base leading-relaxed mb-5 md:mb-8">{{ localized(services[0], 'short_description') }}</p>
                                <div class="flex items-center space-x-3 mb-5 md:mb-8">
                                    <span class="text-gold text-2xl md:text-3xl font-bold">{{ price(services[0].price_from) }}</span>
                                    <span v-if="services[0].price_to" class="text-white/30 text-sm md:text-lg">– {{ price(services[0].price_to) }}</span>
                                </div>
                                <div class="flex items-center gap-3 md:gap-4">
                                    <Link :href="'/services/' + services[0].slug"
                                          class="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-gold text-dark font-bold rounded-full text-sm md:text-base hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all duration-500">
                                        <span>{{ t('servicesPage.learnMore') }}</span>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                    </Link>
                                    <span v-if="services[0].duration" class="text-white/30 text-xs md:text-sm flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        {{ services[0].duration }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rest of services -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div v-for="(service, index) in services.slice(1)" :key="service.id"
                         class="group relative bg-surface border border-white/[0.04] rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:-translate-y-1">
                        <!-- Image -->
                        <div class="h-36 md:h-52 relative overflow-hidden">
                            <img v-if="service.image" :src="'/storage/' + service.image" :alt="localized(service, 'name')" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/>
                            <div v-else class="w-full h-full bg-gradient-to-br from-gold/[0.06] via-surface to-surface flex items-center justify-center relative">
                                <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2249%22 viewBox=%220 0 28 49%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23d4af37%22 fill-opacity=%221%22%3E%3Cpath d=%22M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
                                <div class="relative z-10 w-16 h-16 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-500">
                                    <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="serviceIcons[(index + 1) % serviceIcons.length]"/></svg>
                                </div>
                            </div>
                            <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"></div>
                            <div v-if="service.is_featured" class="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 bg-gold/90 text-dark text-[9px] font-black rounded-full uppercase tracking-wider">
                                {{ t('servicesPage.popular') }}
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-5 md:p-7">
                            <h3 class="text-xl font-bold mb-2 group-hover:text-gold transition-colors duration-300">{{ localized(service, 'name') }}</h3>
                            <p class="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2">{{ localized(service, 'short_description') }}</p>

                            <div class="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                                <div>
                                    <span class="text-gold text-xl font-bold">{{ price(service.price_from) }}</span>
                                    <span v-if="service.price_to" class="text-white/30 text-sm ml-1">– {{ price(service.price_to) }}</span>
                                    <span v-if="service.duration" class="flex items-center text-white/30 text-xs mt-1.5">
                                        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        {{ service.duration }}
                                    </span>
                                </div>
                                <Link :href="'/services/' + service.slug"
                                      class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-dark text-white/40 transition-all duration-300">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="py-28 bg-dark relative overflow-hidden">
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 50% 50%, rgba(212,175,55,0.8) 0%, transparent 50%);"></div>
            <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 class="text-3xl lg:text-5xl font-bold mb-6" style="font-family: 'Playfair Display', serif;">{{ c('servicesPage.ctaTitle') }}</h2>
                <p class="text-white/50 text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">{{ c('servicesPage.ctaText') }}</p>
                <Link href="/contact" class="group inline-flex items-center space-x-3 px-10 py-5 bg-gold text-dark font-bold rounded-full text-base hover:bg-gold-light hover:shadow-[0_0_50px_rgba(201,168,76,0.3)] transform hover:-translate-y-0.5 transition-all duration-500">
                    <span>{{ c('servicesPage.ctaButton') }}</span>
                    <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { Link, Head } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import { useI18n } from '@/i18n.js';

const { t, c, localized, price } = useI18n();

defineProps({
    services: Array,
});

const serviceIcons = [
    // Exterior - car sparkle
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    // Interior - seat/couch
    'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    // Ceramic - shield
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    // Paint correction - adjustments
    'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    // PPF - layers
    'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    // Full detail - star/premium
    'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
];
</script>
