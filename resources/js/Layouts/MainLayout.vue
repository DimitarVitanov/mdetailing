<template>
    <!-- Head tags come from the `seo` prop (app/Support/Seo.php). The root template prints the
         same tags with the same keys for crawlers, and Inertia keeps them current from here. -->
    <Head v-if="seo" :title="seo.title">
        <component :is="tag.tag" v-for="tag in seo.tags" :key="tag.key" v-bind="tag.attrs" :head-key="tag.key" />
        <component :is="'script'" v-if="seo.schema" type="application/ld+json" head-key="schema">{{ seo.schema }}</component>
    </Head>

    <a href="#main" class="sr-only z-[100] rounded-full bg-signal px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {{ t('nav.skip') }}
    </a>

    <!-- ═════════ Header ═════════ -->
    <header class="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo"
            :class="hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'">
        <div class="transition-[background-color,border-color,backdrop-filter] duration-500"
             :class="scrolled || menuOpen ? 'border-b border-white/[0.06] bg-ink/[0.92]' : 'border-b border-transparent'">
            <div class="container-x flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
                <Link href="/" class="relative z-[60] flex shrink-0 items-center" :aria-label="'MDetailing — ' + t('footer.home')">
                    <img src="/img/brand/logo-120.webp" srcset="/img/brand/logo-120.webp 1x, /img/brand/logo-240.webp 2x"
                         width="120" height="90" alt="MDetailing Premium Car Care" fetchpriority="high"
                         class="h-12 w-auto md:h-14" />
                </Link>

                <nav class="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-1.5 lg:flex" aria-label="Main">
                    <Link v-for="link in links" :key="link.href" :href="link.href" prefetch
                          class="relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300"
                          :class="isActive(link.href) ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:text-white'"
                          :aria-current="isActive(link.href) ? 'page' : undefined">
                        {{ t(link.label) }}
                        <span v-if="isActive(link.href)" class="absolute inset-x-4 -bottom-[7px] h-px bg-signal shadow-[0_0_10px_var(--color-signal)]"></span>
                    </Link>
                </nav>

                <div class="hidden items-center gap-2 lg:flex">
                    <button type="button" @click="toggleLocale()" :aria-label="t('nav.language')"
                            class="grid h-10 min-w-10 place-items-center rounded-full border border-white/10 px-3 text-[11px] font-bold tracking-widest text-white/70 transition-colors hover:border-signal/50 hover:text-signal">
                        {{ getLocale() === 'en' ? 'MK' : 'EN' }}
                    </button>
                    <a v-if="phone" :href="telHref(phone)" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-signal/50 hover:text-signal" :aria-label="t('nav.call') + ' ' + phone">
                        <Icon name="phone" :size="16" />
                    </a>
                    <Link href="/contact" class="btn btn-signal ml-1 !min-h-10 !px-5 !py-2 !text-sm">
                        {{ t('nav.bookNow') }} <Icon name="arrow-right" :size="16" class="btn-arrow" />
                    </Link>
                </div>

                <div class="relative z-[60] flex items-center gap-2 lg:hidden">
                    <button type="button" @click="toggleLocale()" :aria-label="t('nav.language')"
                            class="grid h-11 min-w-11 place-items-center rounded-full border border-white/10 px-3 text-[11px] font-bold tracking-widest text-white/75">
                        {{ getLocale() === 'en' ? 'MK' : 'EN' }}
                    </button>
                    <button type="button" @click="menuOpen ? closeMenu() : openMenu()"
                            class="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white"
                            :aria-expanded="menuOpen" aria-controls="mobile-menu" :aria-label="menuOpen ? t('nav.close') : t('nav.menu')">
                        <Icon :name="menuOpen ? 'close' : 'menu'" :size="20" />
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- ═════════ Mobile menu ═════════ -->
    <Transition enter-active-class="transition duration-500 ease-out-expo" enter-from-class="opacity-0" leave-active-class="transition duration-300" leave-to-class="opacity-0">
        <div v-if="menuOpen" id="mobile-menu" class="fixed inset-0 z-40 overflow-y-auto bg-ink lg:hidden" @keydown.esc="closeMenu">
            <div class="hex-grid pointer-events-none absolute inset-0 opacity-60"></div>
            <div class="container-x relative flex min-h-full flex-col pb-10 pt-28">
                <nav class="flex flex-col" aria-label="Mobile">
                    <Link v-for="(link, i) in links" :key="link.href" :href="link.href"
                          class="rise group flex items-baseline gap-5 border-b border-white/[0.06] py-5"
                          :style="{ '--d': i * 60 + 'ms' }">
                        <span class="font-display text-xs text-signal/80">{{ String(i + 1).padStart(2, '0') }}</span>
                        <span class="font-display text-[1.75rem] font-semibold tracking-tight"
                              :class="isActive(link.href) ? 'text-signal' : 'text-white'">{{ t(link.label) }}</span>
                    </Link>
                </nav>

                <div class="rise mt-auto pt-10" style="--d: 360ms">
                    <Link href="/contact" class="btn btn-signal w-full">
                        {{ t('nav.bookNow') }} <Icon name="arrow-right" :size="18" />
                    </Link>
                    <a v-if="phone" :href="telHref(phone)" class="btn btn-ghost mt-3 w-full">
                        <Icon name="phone" :size="17" /> {{ phone }}
                    </a>
                    <p v-if="c('footer.address')" class="mt-6 flex items-center justify-center gap-2 text-sm text-white/50">
                        <Icon name="map-pin" :size="15" /> {{ c('footer.address') }}
                    </p>
                </div>
            </div>
        </div>
    </Transition>

    <!-- ═════════ Toast (booking sent etc.) ═════════ -->
    <div class="pointer-events-none fixed inset-x-0 top-24 z-[70] flex justify-center px-4" aria-live="polite">
        <Transition enter-active-class="transition duration-500 ease-out-expo" enter-from-class="opacity-0 -translate-y-3" leave-active-class="transition duration-300" leave-to-class="opacity-0 -translate-y-3">
            <div v-if="toast" class="glass pointer-events-auto flex max-w-lg items-start gap-3 rounded-2xl px-5 py-4 shadow-2xl">
                <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal text-ink"><Icon name="check" :size="14" stroke-width="3" /></span>
                <p class="text-sm leading-relaxed text-white/90">{{ toast }}</p>
                <button type="button" @click="toast = null" class="-mr-1 ml-2 text-white/50 hover:text-white" :aria-label="t('toast.close')"><Icon name="close" :size="16" /></button>
            </div>
        </Transition>
    </div>

    <main id="main">
        <slot />
    </main>

    <!-- ═════════ Footer ═════════ -->
    <footer class="relative overflow-hidden border-t border-white/[0.06] bg-ink-2 pb-28 lg:pb-0">
        <div class="led pointer-events-none absolute inset-x-0 top-0 opacity-40"></div>
        <div class="container-x grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-12">
            <div class="lg:col-span-4">
                <Link href="/" class="inline-block" aria-label="MDetailing">
                    <img src="/img/brand/logo-240.webp" srcset="/img/brand/logo-240.webp 1x, /img/brand/logo-480.webp 2x"
                         width="240" height="180" alt="MDetailing Premium Car Care" loading="lazy" class="h-24 w-auto" />
                </Link>
                <p class="mt-6 max-w-sm text-sm leading-relaxed text-white/55">{{ c('footer.tagline') }}</p>
                <div v-if="socials.length" class="mt-6">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('footer.follow') }}</p>
                    <div class="mt-3 flex gap-2">
                        <a v-for="social in socials" :key="social.icon" :href="social.href" target="_blank" rel="noopener" :aria-label="social.label"
                           class="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-signal hover:bg-signal hover:text-ink">
                            <Icon :name="social.icon" :size="17" />
                        </a>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <h2 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('footer.navigate') }}</h2>
                <ul class="mt-5 space-y-3 text-sm">
                    <li v-for="link in links" :key="link.href">
                        <Link :href="link.href" class="text-white/70 transition-colors hover:text-signal">{{ t(link.label) }}</Link>
                    </li>
                </ul>
            </div>

            <div class="lg:col-span-3">
                <h2 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('footer.services') }}</h2>
                <ul class="mt-5 space-y-3 text-sm">
                    <li v-for="key in footerServices" :key="key">
                        <Link href="/services" class="text-white/70 transition-colors hover:text-signal">{{ t(key) }}</Link>
                    </li>
                </ul>
            </div>

            <div class="lg:col-span-3">
                <h2 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('footer.getInTouch') }}</h2>
                <ul class="mt-5 space-y-4 text-sm">
                    <li v-if="phone">
                        <a :href="telHref(phone)" class="flex items-center gap-3 text-white transition-colors hover:text-signal">
                            <Icon name="phone" :size="16" class="text-signal" /> {{ phone }}
                        </a>
                    </li>
                    <li v-if="c('footer.email')">
                        <a :href="`mailto:${c('footer.email')}`" class="flex items-center gap-3 text-white/80 transition-colors hover:text-signal">
                            <Icon name="mail" :size="16" class="text-signal" /> {{ c('footer.email') }}
                        </a>
                    </li>
                    <li v-if="c('footer.address')">
                        <a :href="directionsUrl" target="_blank" rel="noopener" class="group flex items-start gap-3 text-white/80 transition-colors hover:text-signal">
                            <Icon name="map-pin" :size="16" class="mt-0.5 shrink-0 text-signal" />
                            <span>{{ c('footer.address') }}<span class="mt-1 block text-xs text-white/55 group-hover:text-signal">{{ t('footer.directions') }} ↗</span></span>
                        </a>
                    </li>
                </ul>
                <dl class="mt-6 space-y-1.5 border-t border-white/[0.06] pt-5 text-sm">
                    <div v-for="row in hours" :key="row.label" class="flex justify-between gap-4">
                        <dt class="text-white/50">{{ row.label }}</dt>
                        <dd class="text-right text-white/85">{{ row.value }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="border-t border-white/[0.06]">
            <div class="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/55 md:flex-row">
                <p>&copy; {{ year }} MDetailing Premium Car Care. {{ t('footer.rights') }}</p>
                <p>{{ t('footer.crafted') }}</p>
            </div>
        </div>
    </footer>

    <!-- ═════════ Mobile action bar ═════════ -->
    <Transition enter-active-class="transition duration-500 ease-out-expo" enter-from-class="translate-y-full" leave-active-class="transition duration-300" leave-to-class="translate-y-full">
        <div v-if="!menuOpen && showBar" class="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
            <div class="glass mx-auto flex max-w-md gap-2 rounded-full p-1.5 shadow-[0_20px_50px_rgb(0_0_0/0.6)]">
                <a v-if="phone" :href="telHref(phone)" class="btn btn-ghost !min-h-12 flex-1 !border-transparent !bg-white/[0.06]">
                    <Icon name="phone" :size="17" /> {{ t('nav.call') }}
                </a>
                <Link href="/contact" class="btn btn-signal !min-h-12 flex-[1.4]">
                    <Icon name="calendar" :size="17" /> {{ t('nav.bookNow') }}
                </Link>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import { telHref, useI18n } from '@/i18n.js';
import { lockScroll } from '@/lib/motion.js';

const page = usePage();
const { t, c, getLocale, toggleLocale } = useI18n();

const seo = computed(() => page.props.seo);
const phone = computed(() => c('footer.phone'));
const year = new Date().getFullYear();

const links = [
    { href: '/', label: 'nav.home' },
    { href: '/services', label: 'nav.services' },
    { href: '/portfolio', label: 'nav.portfolio' },
    { href: '/about', label: 'nav.about' },
    { href: '/contact', label: 'nav.contact' },
];
const footerServices = ['footer.ceramicCoating', 'footer.paintCorrection', 'footer.ppf', 'footer.interiorExterior'];

const path = computed(() => (page.url || '/').split(/[?#]/)[0]);
const isActive = (href) => (href === '/' ? path.value === '/' : path.value.startsWith(href));

const socials = computed(() =>
    [
        { icon: 'instagram', label: 'Instagram', href: c('social.instagram') },
        { icon: 'facebook', label: 'Facebook', href: c('social.facebook') },
        { icon: 'tiktok', label: 'TikTok', href: c('social.tiktok') },
    ].filter((social) => /^https?:\/\//.test(social.href)),
);

const hours = computed(() =>
    [
        { label: t('contactPage.monFri'), value: c('contactPage.hours.monFri') },
        { label: t('contactPage.saturday'), value: c('contactPage.hours.saturday') },
        { label: t('contactPage.sunday'), value: c('contactPage.hours.sunday') },
    ].filter((row) => row.value),
);

const directionsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c('contact.mapQuery') || 'MDetailing.mk')}`);

// ── Header: glass once scrolled, tucks away while scrolling down, back on scroll up ──
const scrolled = ref(false);
const hidden = ref(false);
const showBar = ref(false);
let lastY = 0;
let ticking = false;

function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const y = window.scrollY;
        scrolled.value = y > 24;
        hidden.value = y > 420 && y > lastY + 4 ? true : y < lastY - 4 ? false : hidden.value;
        showBar.value = y > 280;
        lastY = y;
        ticking = false;
    });
}

// ── Mobile menu ──
const menuOpen = ref(false);
function openMenu() {
    menuOpen.value = true;
    lockScroll(true);
}
function closeMenu() {
    if (!menuOpen.value) return;
    menuOpen.value = false;
    lockScroll(false);
}
const onKey = (event) => event.key === 'Escape' && closeMenu();

// ── Toast for flash messages (e.g. booking sent) ──
const toast = ref(null);
let toastTimer;
watch(
    () => page.props.flash,
    (flash) => {
        // The contact page shows its own confirmation panel.
        if (!flash?.success || typeof window === 'undefined' || page.component === 'Contact') return;
        toast.value = flash.success;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => (toast.value = null), 7000);
    },
    { immediate: true },
);

let stopNavigate;
onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onScroll();
    stopNavigate = router.on('navigate', () => {
        closeMenu();
        hidden.value = false;
    });
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('keydown', onKey);
    stopNavigate?.();
    clearTimeout(toastTimer);
    lockScroll(false);
});
</script>
