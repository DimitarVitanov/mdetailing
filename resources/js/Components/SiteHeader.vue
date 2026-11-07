<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import { telHref, useI18n } from '@/i18n.js';
import { lockScroll } from '@/lib/motion';

const page = usePage();
const { t, c, getLocale, toggleLocale } = useI18n();
const phone = computed(() => c('footer.phone'));

const nav = [
    { href: '/', label: 'nav.home' },
    { href: '/services', label: 'nav.services' },
    { href: '/portfolio', label: 'nav.portfolio' },
    { href: '/about', label: 'nav.about' },
    { href: '/contact', label: 'nav.contact' },
];

const path = computed(() => (page.url || '/').split(/[?#]/)[0]);
const isActive = (href) => (href === '/' ? path.value === '/' : path.value.startsWith(href));

const hours = computed(() =>
    [
        { label: t('contactPage.monFri'), value: c('contactPage.hours.monFri') },
        { label: t('contactPage.saturday'), value: c('contactPage.hours.saturday') },
    ].filter((r) => r.value),
);

// Hides while scrolling down, comes back on the way up; solid once off the hero. Written as
// data attributes so the header doesn't re-render on every scroll frame.
const bar = ref(null);
const open = ref(false);
let hidden = false;
let lastY = 0;

function onScroll() {
    const y = window.scrollY;
    if (open.value || y <= 240) hidden = false;
    else if (y > lastY + 2) hidden = true;
    else if (y < lastY - 2) hidden = false;
    lastY = y;
    bar.value?.toggleAttribute('data-hidden', hidden);
    bar.value?.toggleAttribute('data-solid', y > 40 && !open.value);
}

watch(open, (value) => { lockScroll(value); onScroll(); });
watch(() => page.url, () => (open.value = false));

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
    lockScroll(false);
});
</script>

<template>
    <header ref="bar" class="fixed top-0 inset-x-0 z-50 border-b border-transparent transition-[translate,background-color,border-color] duration-500 ease-[var(--ease-forge)] data-[hidden]:-translate-y-full data-[solid]:bg-ink/85 data-[solid]:backdrop-blur-xl data-[solid]:border-white/[0.06]">
        <nav class="container-x h-20 flex items-center justify-between gap-6" aria-label="Main">
            <Link href="/" class="relative flex items-center" aria-label="MDetailing">
                <img src="/img/brand/logo-120.webp" srcset="/img/brand/logo-120.webp 1x, /img/brand/logo-240.webp 2x" width="120" height="90" alt="MDetailing Premium Car Care" fetchpriority="high" class="h-12 md:h-14 w-auto">
            </Link>

            <div class="hidden lg:flex items-center gap-1">
                <Link v-for="item in nav" :key="item.href" :href="item.href" prefetch class="roll-link relative px-3.5 py-2 font-display text-[11px] font-bold tracking-[0.2em]" :class="isActive(item.href) ? 'text-white is-active' : 'text-body hover:text-white'" :aria-current="isActive(item.href) ? 'page' : undefined">
                    <span class="block overflow-hidden h-[1.2em] leading-[1.2em]">
                        <span class="roll-inner block">
                            <span class="block">{{ t(item.label) }}</span>
                            <span class="block text-signal" aria-hidden="true">{{ t(item.label) }}</span>
                        </span>
                    </span>
                </Link>
            </div>

            <div class="flex items-center gap-3 sm:gap-4">
                <button type="button" @click="toggleLocale()" :aria-label="t('nav.language')" class="font-display text-[11px] tracking-[0.2em] text-body hover:text-signal transition-colors">
                    {{ getLocale() === 'en' ? 'MK' : 'EN' }}
                </button>
                <a v-if="phone" :href="telHref(phone)" class="hidden sm:grid h-10 w-10 place-items-center border border-white/15 hover:border-signal hover:text-signal transition-colors clip-cut-sm" :aria-label="t('nav.call')"><Icon name="phone" :size="16" /></a>
                <Link href="/contact" class="hidden md:inline-flex btn-signal !px-6 !py-3 !text-[10px]">{{ t('nav.bookNow') }}</Link>
                <!-- menu switch: a small LED that turns on -->
                <button type="button" class="lg:hidden relative flex items-center gap-3 h-11 pl-3 font-display text-[10px] tracking-[0.25em] text-white" :aria-expanded="open" aria-controls="mobile-menu" @click="open = !open">
                    {{ open ? t('nav.close') : t('nav.menu') }}
                    <span class="grid place-items-center w-9 h-9 clip-hex transition-colors duration-300" :class="open ? 'bg-led' : 'bg-white/10'">
                        <span class="w-2 h-2 clip-hex transition-colors duration-300" :class="open ? 'bg-ink' : 'bg-led'"></span>
                    </span>
                </button>
            </div>
        </nav>
    </header>

    <!-- Mobile menu: a shutter that rolls down from the top, items lit one after another. -->
    <div id="mobile-menu" class="lg:hidden fixed inset-0 z-[45] bg-ink overflow-y-auto transition-transform duration-700 ease-[var(--ease-in-out-quart)]" :class="open ? 'translate-y-0' : '-translate-y-full'" :inert="!open || undefined">
        <div class="absolute inset-0 pointer-events-none" style="background-image: repeating-linear-gradient(180deg, transparent 0 46px, rgb(255 255 255 / 0.04) 46px 48px);"></div>
        <div class="hex-grid absolute inset-0 opacity-[0.05] pointer-events-none"></div>
        <div class="led absolute bottom-0 inset-x-0 transition-opacity duration-500" :class="open ? 'opacity-100 delay-700' : 'opacity-0'"></div>

        <div class="relative min-h-full flex flex-col px-6 pt-28 pb-10">
            <ul class="flex-1">
                <li v-for="(item, i) in nav" :key="item.href" class="border-t border-white/[0.07] last:border-b">
                    <Link :href="item.href" class="menu-item flex items-center gap-5 py-5 font-display text-[2rem] sm:text-5xl leading-none transition-[transform,opacity] duration-700 ease-[var(--ease-forge)]" :class="[open ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0', isActive(item.href) ? 'text-signal' : 'text-white']" :style="{ transitionDelay: open ? `${250 + i * 70}ms` : '0ms' }">
                        <span class="relative w-1.5 h-9 shrink-0 bg-white/10 overflow-hidden">
                            <span class="absolute inset-0 bg-led shadow-[0_0_12px_var(--color-led)] origin-bottom transition-transform duration-500 ease-[var(--ease-forge)]" :class="open ? 'scale-y-100' : 'scale-y-0'" :style="{ transitionDelay: open ? `${450 + i * 70}ms` : '0ms' }"></span>
                        </span>
                        <span class="font-display text-[10px] tracking-[0.3em] text-steel w-6">{{ String(i + 1).padStart(2, '0') }}</span>
                        {{ t(item.label) }}
                    </Link>
                </li>
            </ul>

            <div class="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 items-end transition-opacity duration-500" :class="open ? 'opacity-100 delay-700' : 'opacity-0'">
                <div class="col-span-2">
                    <Link href="/contact" class="btn-signal w-full">{{ t('nav.bookNow') }} <Icon name="arrow-right" :size="14" /></Link>
                </div>
                <div>
                    <p class="s-label mb-2">{{ t('contactPage.phone') }}</p>
                    <a v-if="phone" :href="telHref(phone)" class="font-display text-sm text-white">{{ phone }}</a>
                </div>
                <div>
                    <p class="s-label mb-2">{{ t('contactPage.hours') }}</p>
                    <p v-for="r in hours" :key="r.label" class="text-xs text-body">{{ r.label }}: <span class="text-white">{{ r.value }}</span></p>
                </div>
                <p v-if="c('footer.address')" class="col-span-2 text-xs text-steel flex items-center gap-2"><Icon name="map-pin" :size="13" class="text-led" /> {{ c('footer.address') }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.roll-inner { transition: transform 0.55s var(--ease-forge); }
.roll-link:hover .roll-inner { transform: translateY(-50%); }
.roll-link::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 2px;
    height: 2px;
    background: var(--color-signal);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.5s var(--ease-forge);
}
.roll-link.is-active::after { transform: scaleX(1); transform-origin: left; }
</style>
