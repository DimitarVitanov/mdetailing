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

// Hides while scrolling down, comes back on the way up; solid once off the hero. Written as
// data attributes so the header doesn't re-render on every scroll frame.
const bar = ref(null);
const open = ref(false);
const origin = ref('100% 0%');
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

function toggle(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    origin.value = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
    open.value = !open.value;
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
                <button type="button" class="lg:hidden relative flex items-center gap-3 h-11 pl-3 pr-1 font-display text-[10px] tracking-[0.25em] text-white" :aria-expanded="open" aria-controls="mobile-menu" @click="toggle">
                    {{ open ? t('nav.close') : t('nav.menu') }}
                    <span class="relative w-7 h-3">
                        <span class="absolute left-0 right-0 h-0.5 bg-current transition-transform duration-500 ease-[var(--ease-forge)]" :class="open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'"></span>
                        <span class="absolute right-0 h-0.5 bg-signal transition-all duration-500 ease-[var(--ease-forge)]" :class="open ? 'top-1/2 -translate-y-1/2 -rotate-45 left-0 bg-current' : 'bottom-0 left-2.5'"></span>
                    </span>
                </button>
            </div>
        </nav>
    </header>

    <!-- Mobile menu: a signal circle grows out of the button. -->
    <div id="mobile-menu" class="lg:hidden fixed inset-0 z-[45] bg-signal text-ink transition-[clip-path] duration-700 ease-[var(--ease-forge)] overflow-y-auto" :style="{ clipPath: open ? `circle(150% at ${origin})` : `circle(0% at ${origin})` }" :inert="!open || undefined">
        <div class="hex-grid-ink absolute inset-0 opacity-[0.08] pointer-events-none"></div>
        <div class="relative min-h-full flex flex-col px-6 pt-28 pb-10">
            <ul class="flex-1 space-y-1">
                <li v-for="(item, i) in nav" :key="item.href" class="overflow-hidden">
                    <Link :href="item.href" class="menu-item flex items-baseline gap-4 py-2 font-display text-[2.4rem] sm:text-6xl leading-none" :class="[open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0', isActive(item.href) ? 'text-white' : 'text-ink']" :style="{ transitionDelay: open ? `${180 + i * 60}ms` : '0ms' }">
                        <span class="font-display text-[10px] tracking-[0.3em] text-ink/60">{{ String(i + 1).padStart(2, '0') }}</span>
                        {{ t(item.label) }}
                    </Link>
                </li>
            </ul>
            <div class="mt-10 pt-6 border-t border-ink/20 space-y-4 transition-opacity duration-500" :class="open ? 'opacity-100 delay-500' : 'opacity-0'">
                <Link href="/contact" class="btn-ghost btn-ghost-ink w-full !shadow-[inset_0_0_0_1px_rgb(7_8_10/0.6)] hover:!bg-ink hover:!text-signal">{{ t('nav.bookNow') }}</Link>
                <a v-if="phone" :href="telHref(phone)" class="flex items-center gap-3 font-display text-sm text-ink"><Icon name="phone" :size="16" /> {{ phone }}</a>
                <p v-if="c('footer.address')" class="text-sm text-ink/70">{{ c('footer.address') }}</p>
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
.menu-item { transition: transform 0.8s var(--ease-forge), opacity 0.5s ease, color 0.3s; }
</style>
