<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import MaskLines from '@/Components/MaskLines.vue';
import Sparks from '@/Components/Sparks.vue';
import { telHref, useI18n } from '@/i18n.js';
import { getLenis } from '@/lib/motion';

const { t, c } = useI18n();
const page = usePage();
const showCta = computed(() => page.component !== 'Home');
const phone = computed(() => c('footer.phone'));
const year = new Date().getFullYear();

const links = [
    { href: '/', label: 'nav.home' },
    { href: '/services', label: 'nav.services' },
    { href: '/portfolio', label: 'nav.portfolio' },
    { href: '/about', label: 'nav.about' },
    { href: '/contact', label: 'nav.contact' },
];
const serviceKeys = ['footer.ceramicCoating', 'footer.paintCorrection', 'footer.ppf', 'footer.interiorExterior'];

const socials = computed(() =>
    [
        { icon: 'instagram', label: 'Instagram', href: c('social.instagram') },
        { icon: 'facebook', label: 'Facebook', href: c('social.facebook') },
        { icon: 'tiktok', label: 'TikTok', href: c('social.tiktok') },
    ].filter((s) => /^https?:\/\//.test(s.href)),
);
const hours = computed(() =>
    [
        { label: t('contactPage.monFri'), value: c('contactPage.hours.monFri') },
        { label: t('contactPage.saturday'), value: c('contactPage.hours.saturday') },
        { label: t('contactPage.sunday'), value: c('contactPage.hours.sunday') },
    ].filter((r) => r.value),
);
const directions = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c('contact.mapQuery') || 'MDetailing.mk')}`);

const toTop = () => {
    const lenis = getLenis();
    lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
    <footer class="relative bg-ink overflow-hidden">
        <!-- Call to action -->
        <section v-if="showCta" class="relative border-t border-white/[0.06]">
            <div class="absolute inset-0 opacity-70"><Sparks :density="0.6" /></div>
            <div class="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink pointer-events-none"></div>
            <div class="container-x relative py-24 md:py-32 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
                <div>
                    <p v-reveal class="eyebrow mb-6">{{ c('cta.title1') }}</p>
                    <MaskLines tag="h2" class="font-display text-5xl sm:text-7xl xl:text-8xl leading-[0.92]" :lines="[{ text: c('cta.titleAccent'), class: 'text-signal' }]" />
                </div>
                <div v-reveal:150>
                    <p class="text-body text-lg leading-relaxed mb-8 max-w-md">{{ c('cta.subtitle') }}</p>
                    <div class="flex flex-wrap gap-4">
                        <Link href="/contact" class="btn-signal">{{ c('cta.button') }}</Link>
                        <a v-if="phone" :href="telHref(phone)" class="btn-ghost"><Icon name="phone" :size="15" /> {{ phone }}</a>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="showCta" class="led opacity-40"></div>

        <div class="container-x pt-16 pb-10 grid grid-cols-2 md:grid-cols-12 gap-10">
            <div class="col-span-2 md:col-span-5">
                <Link href="/" class="inline-block mb-6"><img src="/img/brand/logo-240.webp" srcset="/img/brand/logo-240.webp 1x, /img/brand/logo-480.webp 2x" width="240" height="180" alt="MDetailing" loading="lazy" class="h-20 w-auto"></Link>
                <p class="text-body text-sm leading-relaxed max-w-sm">{{ c('footer.tagline') }}</p>
                <div v-if="socials.length" class="flex gap-3 mt-6">
                    <a v-for="s in socials" :key="s.icon" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label" class="w-10 h-10 grid place-items-center border border-white/10 hover:border-signal hover:bg-signal hover:text-ink transition-colors clip-cut-sm"><Icon :name="s.icon" :size="16" /></a>
                </div>
            </div>
            <nav class="md:col-span-2" :aria-label="t('footer.navigate')">
                <p class="font-display text-signal text-[10px] tracking-[0.35em] mb-5">{{ t('footer.navigate') }}</p>
                <ul class="space-y-3 text-sm">
                    <li v-for="l in links" :key="l.href"><Link :href="l.href" class="text-body hover:text-signal transition-colors">{{ t(l.label) }}</Link></li>
                </ul>
            </nav>
            <nav class="md:col-span-2" :aria-label="t('footer.services')">
                <p class="font-display text-signal text-[10px] tracking-[0.35em] mb-5">{{ t('footer.services') }}</p>
                <ul class="space-y-3 text-sm">
                    <li v-for="k in serviceKeys" :key="k"><Link href="/services" class="text-body hover:text-signal transition-colors">{{ t(k) }}</Link></li>
                </ul>
            </nav>
            <div class="col-span-2 md:col-span-3">
                <p class="font-display text-signal text-[10px] tracking-[0.35em] mb-5">{{ t('footer.getInTouch') }}</p>
                <a v-if="phone" :href="telHref(phone)" class="block font-display text-base text-white hover:text-signal transition-colors">{{ phone }}</a>
                <a v-if="c('footer.email')" :href="`mailto:${c('footer.email')}`" class="block text-body hover:text-signal transition-colors mt-2 break-all">{{ c('footer.email') }}</a>
                <a v-if="c('footer.address')" :href="directions" target="_blank" rel="noopener" class="block text-body hover:text-signal transition-colors mt-2">{{ c('footer.address') }} ↗</a>
                <dl class="mt-5 space-y-1.5 text-xs text-steel">
                    <div v-for="r in hours" :key="r.label" class="flex justify-between gap-4"><dt>{{ r.label }}</dt><dd class="text-body">{{ r.value }}</dd></div>
                </dl>
            </div>
        </div>

        <!-- Oversized hollow wordmark -->
        <div class="relative px-5 sm:px-8 select-none" aria-hidden="true">
            <MaskLines tag="p" class="font-display text-outline text-center leading-[0.8] text-[15.5vw] tracking-[-0.03em]" :lines="['MDetailing']" />
        </div>

        <div class="border-t border-white/[0.06]">
            <div class="container-x py-6 flex flex-col md:flex-row gap-4 md:items-center justify-between text-xs text-steel">
                <p>© {{ year }} MDetailing Premium Car Care. {{ t('footer.rights') }}</p>
                <button type="button" class="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.25em] text-white hover:text-signal transition-colors" @click="toTop">
                    Top <Icon name="arrow-up-right" :size="14" class="-rotate-45" />
                </button>
            </div>
        </div>
    </footer>
</template>
