<template>
    <div class="min-h-screen bg-dark text-white">
        <!-- Navigation -->
        <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
             :class="scrolled ? 'glass py-2' : 'bg-transparent py-4'">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <!-- Logo -->
                    <Link href="/" class="flex items-center group relative z-[60]">
                        <img src="/img/webp/mdetailing-logo.webp" alt="MDetailing Premium Car Care" class="h-12 w-auto" />
                    </Link>

                    <!-- Desktop Nav -->
                    <div class="hidden md:flex items-center space-x-1">
                        <Link href="/" class="px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300"
                              :class="$page.url === '/' ? 'text-gold' : 'text-white/50 hover:text-white'">
                            {{ t('nav.home') }}
                        </Link>
                        <Link href="/services" class="px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300"
                              :class="$page.url.startsWith('/services') ? 'text-gold' : 'text-white/50 hover:text-white'">
                            {{ t('nav.services') }}
                        </Link>
                        <Link href="/portfolio" class="px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300"
                              :class="$page.url === '/portfolio' ? 'text-gold' : 'text-white/50 hover:text-white'">
                            {{ t('nav.portfolio') }}
                        </Link>
                        <Link href="/about" class="px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300"
                              :class="$page.url === '/about' ? 'text-gold' : 'text-white/50 hover:text-white'">
                            {{ t('nav.about') }}
                        </Link>
                        <Link href="/contact" class="px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300"
                              :class="$page.url === '/contact' ? 'text-gold' : 'text-white/50 hover:text-white'">
                            {{ t('nav.contact') }}
                        </Link>

                        <!-- Language Switcher -->
                        <button @click="toggleLocale()"
                                class="ml-2 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/10 text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300">
                            {{ getLocale() === 'en' ? 'MK' : 'EN' }}
                        </button>

                        <Link href="/contact"
                              class="ml-4 px-6 py-2.5 bg-gold text-dark font-bold text-sm rounded-full hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] transition-all duration-500">
                            {{ t('nav.bookNow') }}
                        </Link>
                    </div>

                    <!-- Mobile: Lang + Menu Button -->
                    <div class="flex items-center space-x-3 md:hidden relative z-[60]">
                        <button @click="toggleLocale()"
                                class="px-2.5 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/10 text-white/40 hover:text-gold transition-all">
                            {{ getLocale() === 'en' ? 'MK' : 'EN' }}
                        </button>
                        <button @click="toggleMobile" class="p-2 text-white/80 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Full-Screen Mobile Menu -->
        <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="mobileOpen"
                 class="fixed inset-0 z-40 md:hidden"
                 style="background: rgba(3,3,3,0.97); backdrop-filter: blur(30px) saturate(1.2);">
                <div class="h-full flex flex-col justify-center items-center px-8">
                    <!-- Nav Links -->
                    <div class="flex flex-col items-center space-y-2 w-full max-w-sm">
                        <Link v-for="(link, i) in mobileLinks" :key="link.href"
                              :href="link.href"
                              @click="closeMobile"
                              class="text-3xl font-extrabold tracking-tight text-white/80 hover:text-gold transition-colors duration-300 py-3"
                              :style="{ transitionDelay: (i * 50) + 'ms', fontFamily: '\'Playfair Display\', serif' }">
                            {{ t(link.labelKey) }}
                        </Link>
                    </div>

                    <!-- CTA Button -->
                    <div class="mt-10">
                        <Link href="/contact" @click="closeMobile"
                              class="inline-flex items-center px-10 py-4 bg-gold text-dark font-bold rounded-full text-base hover:bg-gold-light transition-all duration-300">
                            {{ t('nav.bookNow') }}
                            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </Link>
                    </div>

                    <!-- Footer info -->
                    <div class="mt-12 text-center">
                        <p class="text-white/20 text-xs tracking-wider">{{ c('footer.phone') }}</p>
                        <p v-if="c('footer.email')" class="text-white/20 text-xs tracking-wider mt-1">{{ c('footer.email') }}</p>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Flash Messages -->
        <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2">
            <div v-if="$page.props.flash?.success" class="fixed top-24 right-4 z-50 bg-green-600/90 backdrop-blur text-white px-6 py-3 rounded-lg shadow-lg">
                {{ $page.props.flash.success }}
            </div>
        </transition>

        <!-- Main Content -->
        <main>
            <slot />
        </main>

        <!-- Footer -->
        <footer class="bg-darker border-t border-white/[0.04]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <!-- Brand -->
                    <div class="md:col-span-4">
                        <Link href="/" class="inline-block mb-5">
                            <img src="/img/webp/mdetailing-logo.webp" alt="MDetailing Premium Car Care" class="h-14 w-auto" />
                        </Link>
                        <p class="text-white/30 text-sm leading-relaxed max-w-xs">
                            {{ c('footer.tagline') }}
                        </p>
                        <div class="flex items-center space-x-3 mt-6">
                            <a href="#" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:bg-gold/10 hover:text-gold transition-all duration-300">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </a>
                            <a href="#" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:bg-gold/10 hover:text-gold transition-all duration-300">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                            </a>
                            <a href="#" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:bg-gold/10 hover:text-gold transition-all duration-300">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46 6.28 6.28 0 001.86-4.46V8.73a8.26 8.26 0 004.84 1.56v-3.4a4.78 4.78 0 01-1.12-.2z"/></svg>
                            </a>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="md:col-span-2">
                        <h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">{{ t('footer.navigate') }}</h4>
                        <ul class="space-y-3">
                            <li><Link href="/services" class="text-white/30 hover:text-gold transition-colors text-sm">{{ t('nav.services') }}</Link></li>
                            <li><Link href="/portfolio" class="text-white/30 hover:text-gold transition-colors text-sm">{{ t('nav.portfolio') }}</Link></li>
                            <li><Link href="/about" class="text-white/30 hover:text-gold transition-colors text-sm">{{ t('nav.about') }}</Link></li>
                            <li><Link href="/contact" class="text-white/30 hover:text-gold transition-colors text-sm">{{ t('nav.contact') }}</Link></li>
                        </ul>
                    </div>

                    <!-- Services -->
                    <div class="md:col-span-3">
                        <h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">{{ t('footer.services') }}</h4>
                        <ul class="space-y-3">
                            <li><span class="text-white/30 text-sm">{{ t('footer.ceramicCoating') }}</span></li>
                            <li><span class="text-white/30 text-sm">{{ t('footer.paintCorrection') }}</span></li>
                            <li><span class="text-white/30 text-sm">{{ t('footer.ppf') }}</span></li>
                            <li><span class="text-white/30 text-sm">{{ t('footer.interiorExterior') }}</span></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div class="md:col-span-3">
                        <h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">{{ t('footer.getInTouch') }}</h4>
                        <ul class="space-y-3">
                            <li class="text-white/30 text-sm">{{ c('footer.phone') }}</li>
                            <li v-if="c('footer.email')" class="text-white/30 text-sm">{{ c('footer.email') }}</li>
                            <li class="text-white/30 text-sm">{{ c('footer.address') }}</li>
                        </ul>
                    </div>
                </div>

                <div class="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-white/20 text-xs tracking-wider">&copy; {{ new Date().getFullYear() }} MDetailing Premium Car Care. {{ t('footer.rights') }}</p>
                    <p class="text-white/20 text-xs tracking-wider">{{ t('footer.crafted') }}</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { useI18n } from '@/i18n.js';

const { t, c, getLocale, toggleLocale } = useI18n();

const scrolled = ref(false);
const mobileOpen = ref(false);

const mobileLinks = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/services', labelKey: 'nav.services' },
    { href: '/portfolio', labelKey: 'nav.portfolio' },
    { href: '/about', labelKey: 'nav.about' },
    { href: '/contact', labelKey: 'nav.contact' },
];

const handleScroll = () => {
    scrolled.value = window.scrollY > 50;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

function openMobile() {
    mobileOpen.value = true;
    document.body.style.overflow = 'hidden';
}

function closeMobile() {
    mobileOpen.value = false;
    document.body.style.overflow = '';
}

function toggleMobile() {
    if (mobileOpen.value) {
        closeMobile();
    } else {
        openMobile();
    }
}
</script>
