<template>
    <MainLayout>
        <!-- ═══════════════════ HERO ═══════════════════ -->
        <section class="relative h-screen overflow-hidden">
            <!-- Cinematic background image -->
            <div class="absolute inset-0">
                <img src="/img/webp/hero-studio.webp"
                     alt="MDetailing Premium Car Care Studio" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            </div>

            <!-- Floating gold accent orbs -->
            <div class="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px] float"></div>
            <div class="absolute bottom-1/3 left-1/6 w-[300px] h-[300px] bg-gold/[0.03] rounded-full blur-[100px] float" style="animation-delay:-3s"></div>

            <!-- Content -->
            <div class="relative z-10 h-full flex items-center">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div class="max-w-3xl">
                        <div class="animate-fade-in" style="animation-delay: 0.1s">
                            <span class="inline-flex items-center glass-gold rounded-full px-5 py-2 mb-8">
                                <span class="w-2 h-2 bg-gold rounded-full mr-3 animate-pulse"></span>
                                <span class="text-gold/90 text-xs font-semibold tracking-[0.25em] uppercase">{{ c('hero.badge') }}</span>
                            </span>
                        </div>

                        <h1 class="animate-fade-in" style="animation-delay: 0.2s">
                            <span class="block text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.9]" style="font-family: 'Playfair Display', serif;">
                                {{ c('hero.title1') }}
                            </span>
                            <span class="block text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mt-2" style="font-family: 'Playfair Display', serif;">
                                {{ c('hero.title2') }} <span class="text-gradient-gold italic">{{ c('hero.title3') }}</span>
                            </span>
                        </h1>

                        <p class="animate-fade-in text-lg sm:text-xl text-white/60 max-w-xl mt-8 leading-relaxed font-light" style="animation-delay: 0.3s">
                            {{ c('hero.subtitle') }}
                        </p>

                        <div class="animate-fade-in flex flex-col sm:flex-row gap-4 mt-10" style="animation-delay: 0.4s">
                            <Link href="/contact"
                                  class="group inline-flex items-center justify-center px-8 py-4 bg-gold text-dark font-bold rounded-full text-base hover:bg-gold-light hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] transition-all duration-500">
                                <span>{{ c('hero.cta') }}</span>
                                <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            </Link>
                            <Link href="/services"
                                  class="inline-flex items-center justify-center px-8 py-4 glass text-white font-semibold rounded-full text-base hover:bg-white/10 transition-all duration-300">
                                {{ c('hero.ctaSecondary') }}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scroll indicator -->
            <div class="animate-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center" style="animation-delay: 0.5s">
                <div class="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold/50 to-transparent scroll-line"></div>
            </div>
        </section>

        <!-- ═══════════════════ MARQUEE STRIP ═══════════════════ -->
        <div class="bg-surface py-4 overflow-hidden">
            <div class="marquee-track flex items-center whitespace-nowrap">
                <span v-for="i in 3" :key="i" class="flex items-center">
                    <span v-for="item in marqueeItems" :key="item" class="flex items-center mx-8">
                        <span class="w-1.5 h-1.5 bg-gold rounded-full mr-4"></span>
                        <span class="text-sm font-semibold tracking-widest uppercase text-white/30">{{ item }}</span>
                    </span>
                </span>
            </div>
        </div>

        <!-- ═══════════════════ SERVICES ═══════════════════ -->
        <section class="py-16 md:py-28 bg-dark relative overflow-hidden bg-noise">
            <div class="absolute -top-48 -right-48 w-[600px] h-[600px] bg-gold/[0.02] rounded-full blur-[150px]"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div data-aos="fade-up" class="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 md:mb-16 gap-4">
                    <div>
                        <span class="text-gold text-xs font-bold tracking-[0.3em] uppercase">{{ c('services.label') }}</span>
                        <h2 class="text-3xl md:text-4xl lg:text-6xl font-extrabold mt-2 md:mt-3 leading-tight" style="font-family: 'Playfair Display', serif;">
                            {{ c('services.title') }} <span class="text-gradient-gold">{{ c('services.titleAccent') }}</span>
                        </h2>
                        <p class="text-white/50 text-sm mt-3">{{ t('services.note') }}</p>
                    </div>
                    <Link href="/services" class="inline-flex items-center space-x-2 text-white/50 hover:text-gold font-medium transition-colors text-sm tracking-wider uppercase group">
                        <span>{{ c('services.viewAll', 'View All') }}</span>
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </Link>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div v-for="(service, index) in services" :key="service.id"
                         data-aos="fade-up" :data-aos-delay="index * 100"
                         class="group relative bg-surface rounded-2xl overflow-hidden border border-white/[0.04] hover:border-gold/20 transition-all duration-500">
                        <div class="h-36 md:h-48 relative overflow-hidden">
                            <img :src="service.image ? '/storage/' + service.image : serviceImages[index % serviceImages.length]"
                                 :alt="localized(service, 'name')"
                                 class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>
                            <div v-if="service.is_featured" class="absolute top-3 right-3 md:top-4 md:right-4 bg-gold/90 text-dark text-[9px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider">{{ t('services.popular') }}</div>
                        </div>
                        <div class="p-4 md:p-6 md:pb-8 relative">
                            <h3 class="text-base md:text-lg font-bold mb-1.5 md:mb-2 group-hover:text-gold transition-colors duration-300">{{ localized(service, 'name') }}</h3>
                            <p class="text-white/40 text-xs md:text-sm leading-relaxed mb-4 md:mb-5 line-clamp-2">{{ localized(service, 'short_description') }}</p>
                            <div class="flex items-center justify-between">
                                <div>
                                    <span class="text-gold text-lg md:text-xl font-bold">{{ price(service.price_from) }}</span>
                                    <span v-if="service.price_to" class="text-white/30 text-xs md:text-sm ml-1">– {{ price(service.price_to) }}</span>
                                </div>
                                <Link :href="'/services/' + service.slug"
                                      class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-dark text-white/40 transition-all duration-300">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════ SHOWCASE SPLIT ═══════════════════ -->
        <section class="relative bg-darker overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
                <!-- Image side -->
                <div data-aos="fade-right" class="relative overflow-hidden">
                    <img src="/img/webp/audi-black-front.webp"
                         alt="Audi detailing under studio lights"
                         class="w-full h-full object-cover min-h-[400px] lg:min-h-0" />
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent to-darker/80 hidden lg:block"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-darker to-transparent lg:hidden"></div>
                </div>
                <!-- Content side -->
                <div class="flex items-center px-8 lg:px-16 py-16 lg:py-0 relative">
                    <div data-aos="fade-left" class="max-w-lg">
                        <span class="text-gold text-xs font-bold tracking-[0.3em] uppercase">{{ c('showcase.label') }}</span>
                        <h2 class="text-4xl lg:text-5xl font-extrabold mt-4 mb-8 leading-tight" style="font-family: 'Playfair Display', serif;">
                            {{ c('showcase.title1') }}<br>{{ c('showcase.title2') }} <span class="italic text-gradient-gold">{{ c('showcase.titleAccent') }}</span>
                        </h2>
                        <div class="space-y-6">
                            <div v-for="(feat, i) in features" :key="i" class="flex items-start space-x-4 group">
                                <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold/20 transition-colors">
                                    <span class="text-gold font-bold text-sm">{{ String(i + 1).padStart(2, '0') }}</span>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-white text-sm mb-1">{{ feat.title }}</h4>
                                    <p class="text-white/40 text-sm leading-relaxed">{{ feat.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════ STATS BAR ═══════════════════ -->
        <section class="py-20 bg-surface relative border-y border-white/[0.04] overflow-hidden shine">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/[0.06]">
                    <div v-for="(stat, i) in stats" :key="i" data-aos="fade-up" :data-aos-delay="i * 100" class="text-center lg:px-8">
                        <div class="text-5xl lg:text-6xl font-black text-gradient-gold leading-none mb-2" style="font-family: 'Playfair Display', serif;">
                            {{ stat.value }}
                        </div>
                        <div class="text-white/30 text-xs font-semibold tracking-[0.2em] uppercase">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════ PORTFOLIO ═══════════════════ -->
        <section v-if="portfolio.length" class="py-28 bg-dark bg-noise">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-aos="fade-up" class="text-center mb-16">
                    <span class="text-gold text-xs font-bold tracking-[0.3em] uppercase">{{ c('portfolio.label') }}</span>
                    <h2 class="text-4xl lg:text-6xl font-extrabold mt-3" style="font-family: 'Playfair Display', serif;">
                        {{ c('portfolio.title') }} <span class="text-gradient-gold italic">{{ c('portfolio.titleAccent') }}</span>
                    </h2>
                </div>

                <!-- Bento grid layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="(item, index) in portfolio" :key="item.id"
                         data-aos="fade-up" :data-aos-delay="index * 100"
                         :class="index === 0 ? 'md:col-span-2 md:row-span-2' : ''"
                         class="group relative overflow-hidden rounded-2xl bg-surface cursor-pointer"
                         :style="{ aspectRatio: index === 0 ? '16/10' : '4/3' }">
                        <img :src="item.after_image ? '/storage/' + item.after_image : portfolioImages[index % portfolioImages.length]"
                             :alt="localized(item, 'title')"
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <!-- Hover reveal -->
                        <div class="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 z-10">
                            <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span class="inline-block px-3 py-1 bg-gold/20 text-gold text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {{ item.category || 'Detail' }}
                                </span>
                                <h3 class="text-white font-bold text-lg lg:text-xl">{{ localized(item, 'title') }}</h3>
                                <p v-if="item.description" class="text-white/50 text-sm mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">{{ localized(item, 'description') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-14">
                    <Link href="/portfolio" class="inline-flex items-center space-x-3 px-8 py-4 glass-gold text-gold font-semibold rounded-full hover:bg-gold/15 transition-all duration-300 group">
                        <span>{{ c('portfolio.viewAll') }}</span>
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </Link>
                </div>
            </div>
        </section>

        <!-- ═══════════════════ TESTIMONIALS ═══════════════════ -->
        <section v-if="testimonials.length" class="py-28 bg-darker relative overflow-hidden">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%);"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div data-aos="fade-up" class="text-center mb-16">
                    <span class="text-gold text-xs font-bold tracking-[0.3em] uppercase">{{ c('testimonials.label') }}</span>
                    <h2 class="text-4xl lg:text-6xl font-extrabold mt-3" style="font-family: 'Playfair Display', serif;">
                        {{ c('testimonials.title') }} <span class="text-gradient-gold italic">{{ c('testimonials.titleAccent') }}</span>
                    </h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(testimonial, i) in testimonials" :key="testimonial.id"
                         data-aos="fade-up" :data-aos-delay="i * 100"
                         class="glass rounded-2xl p-8 hover:border-gold/15 transition-all duration-500 group"
                         :class="i === 1 ? 'lg:-translate-y-4' : ''">
                        <!-- Quote mark -->
                        <div class="text-gold/20 text-6xl font-serif leading-none mb-2" style="font-family: 'Playfair Display', serif;">"</div>
                        <p class="text-white/60 text-sm leading-relaxed mb-8">{{ localized(testimonial, 'content') }}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-11 h-11 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                                    {{ testimonial.client_name.charAt(0) }}
                                </div>
                                <div>
                                    <p class="font-semibold text-white text-sm">{{ testimonial.client_name }}</p>
                                    <p v-if="testimonial.client_vehicle" class="text-white/30 text-xs">{{ testimonial.client_vehicle }}</p>
                                </div>
                            </div>
                            <div class="flex space-x-0.5">
                                <svg v-for="star in testimonial.rating" :key="star" class="w-3.5 h-3.5 text-gold/70" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ═══════════════════ CTA CINEMATIC ═══════════════════ -->
        <section class="relative py-32 overflow-hidden">
            <div class="absolute inset-0">
                <img src="/img/webp/ferrari-01.webp"
                     alt="Ferrari F8 after detailing" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/75"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50"></div>
            </div>
            <div data-aos="fade-up" class="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h2 class="text-4xl lg:text-7xl font-extrabold leading-tight mb-6" style="font-family: 'Playfair Display', serif;">
                    {{ c('cta.title1') }}<br><span class="text-gradient-gold italic">{{ c('cta.titleAccent') }}</span>
                </h2>
                <p class="text-white/50 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    {{ c('cta.subtitle') }}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/contact"
                          class="group inline-flex items-center px-10 py-5 bg-gold text-dark font-bold rounded-full text-lg hover:bg-gold-light hover:shadow-[0_0_60px_rgba(201,168,76,0.25)] transition-all duration-500">
                        <span>{{ c('cta.button') }}</span>
                        <svg class="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </Link>
                    <Link href="/services"
                          class="inline-flex items-center px-10 py-5 glass text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all duration-300">
                        {{ c('cta.buttonSecondary') }}
                    </Link>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { Link, Head } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import { useI18n } from '@/i18n.js';

const { t, c, localized, price } = useI18n();

const props = defineProps({
    services: Array,
    portfolio: Array,
    testimonials: Array,
});

// Data
const marqueeItems = computed(() => t('marquee'));

const serviceImages = [
    '/img/webp/audi-black-side.webp',
    '/img/webp/audi-black-engine.webp',
    '/img/webp/bmw-interior-steering.webp',
    '/img/webp/red-audi-front.webp',
    '/img/webp/audi-black-front-2.webp',
    '/img/webp/bmw-interior-04.webp',
];

const portfolioImages = [
    '/img/webp/ferrari-rear.webp',
    '/img/webp/red-audi-02.webp',
    '/img/webp/gallery-01.webp',
    '/img/webp/audi-black-rear.webp',
    '/img/webp/gallery-03.webp',
    '/img/webp/red-audi-03.webp',
];

const features = computed(() => [
    { title: c('showcase.feature1.title'), description: c('showcase.feature1.description') },
    { title: c('showcase.feature2.title'), description: c('showcase.feature2.description') },
    { title: c('showcase.feature3.title'), description: c('showcase.feature3.description') },
    { title: c('showcase.feature4.title'), description: c('showcase.feature4.description') },
]);

const stats = computed(() => [
    { value: c('stats.cars.value'), label: c('stats.cars.label') },
    { value: c('stats.clients.value'), label: c('stats.clients.label') },
    { value: c('stats.years.value'), label: c('stats.years.label') },
    { value: c('stats.rating.value'), label: c('stats.rating.label') },
]);

</script>

<style scoped>
.scroll-line {
    animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
    0%, 100% { opacity: 0.3; height: 40px; }
    50% { opacity: 0.8; height: 64px; }
}

.marquee-track {
    animation: marquee 20s linear infinite;
}
@media (min-width: 768px) {
    .marquee-track {
        animation-duration: 35s;
    }
}
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.animate-fade-in {
    opacity: 0;
    transform: translateY(15px);
    animation: fadeIn 0.6s ease forwards;
}
@keyframes fadeIn {
    to { opacity: 1; transform: translateY(0); }
}
</style>
