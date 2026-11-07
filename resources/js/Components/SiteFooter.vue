<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import MaskLines from '@/Components/MaskLines.vue';
import { telHref, useI18n } from '@/i18n.js';
import { getLenis } from '@/lib/motion';

const { t, c } = useI18n();
const page = usePage();
// The home page ends with its own full-bleed call to action.
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
    <footer class="relative bg-ink">
        <!-- The yellow floor stripe: the call to action -->
        <section v-if="showCta" class="relative bg-signal text-ink overflow-hidden [clip-path:polygon(0_2.5rem,100%_0,100%_100%,0_100%)] -mb-px">
            <div class="hex-grid-ink absolute inset-0 opacity-[0.07] pointer-events-none"></div>
            <div class="relative container-x pt-20 pb-14 md:pt-28 md:pb-20 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
                <div>
                    <p v-reveal class="eyebrow eyebrow-ink mb-6">{{ c('cta.title1') }}</p>
                    <MaskLines tag="h2" class="font-display text-5xl sm:text-7xl xl:text-8xl leading-[0.92]" :lines="[c('cta.titleAccent')]" />
                </div>
                <div v-reveal:150>
                    <p class="text-ink/75 text-lg leading-relaxed mb-8 max-w-md">{{ c('cta.subtitle') }}</p>
                    <div class="flex flex-wrap gap-3">
                        <Link href="/contact" class="btn-signal !bg-none !bg-ink !text-signal hover:!text-white">{{ c('cta.button') }} <Icon name="arrow-right" :size="14" /></Link>
                        <a v-if="phone" :href="telHref(phone)" class="btn-ghost btn-ghost-ink hover:!text-ink !bg-none hover:!bg-ink/10"><Icon name="phone" :size="15" /> {{ phone }}</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Spec plate -->
        <div class="relative overflow-hidden">
            <div class="hex-grid absolute inset-0 opacity-[0.03] pointer-events-none"></div>
            <div class="relative container-x pt-16 pb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-0">
                <div class="lg:pr-12">
                    <Link href="/" class="inline-block mb-6"><img src="/img/brand/logo-240.webp" srcset="/img/brand/logo-240.webp 1x, /img/brand/logo-480.webp 2x" width="240" height="180" alt="MDetailing" loading="lazy" class="h-20 w-auto"></Link>
                    <p class="text-body text-sm leading-relaxed max-w-xs">{{ c('footer.tagline') }}</p>
                    <div v-if="socials.length" class="flex gap-2 mt-6">
                        <a v-for="s in socials" :key="s.icon" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label" class="w-10 h-10 grid place-items-center bg-white/[0.05] hover:bg-signal hover:text-ink transition-colors clip-hex"><Icon :name="s.icon" :size="15" /></a>
                    </div>
                </div>

                <nav class="lg:border-l lg:border-white/[0.07] lg:px-10" :aria-label="t('footer.navigate')">
                    <p class="font-display text-[10px] tracking-[0.35em] text-led mb-5 flex items-center gap-3"><span class="w-1.5 h-1.5 clip-hex bg-led shadow-[0_0_8px_var(--color-led)]"></span>{{ t('footer.navigate') }}</p>
                    <ul class="space-y-3 text-sm">
                        <li v-for="l in links" :key="l.href"><Link :href="l.href" class="text-body hover:text-white transition-colors">{{ t(l.label) }}</Link></li>
                    </ul>
                </nav>

                <nav class="lg:border-l lg:border-white/[0.07] lg:px-10" :aria-label="t('footer.services')">
                    <p class="font-display text-[10px] tracking-[0.35em] text-led mb-5 flex items-center gap-3"><span class="w-1.5 h-1.5 clip-hex bg-led shadow-[0_0_8px_var(--color-led)]"></span>{{ t('footer.services') }}</p>
                    <ul class="space-y-3 text-sm">
                        <li v-for="k in serviceKeys" :key="k"><Link href="/services" class="text-body hover:text-white transition-colors">{{ t(k) }}</Link></li>
                    </ul>
                </nav>

                <div class="lg:border-l lg:border-white/[0.07] lg:pl-10">
                    <p class="font-display text-[10px] tracking-[0.35em] text-led mb-5 flex items-center gap-3"><span class="w-1.5 h-1.5 clip-hex bg-led shadow-[0_0_8px_var(--color-led)]"></span>{{ t('footer.getInTouch') }}</p>
                    <a v-if="phone" :href="telHref(phone)" class="block font-display text-xl text-white hover:text-signal transition-colors">{{ phone }}</a>
                    <a v-if="c('footer.email')" :href="`mailto:${c('footer.email')}`" class="block text-sm text-body hover:text-white transition-colors mt-2 break-all">{{ c('footer.email') }}</a>
                    <a v-if="c('footer.address')" :href="directions" target="_blank" rel="noopener" class="block text-sm text-body hover:text-white transition-colors mt-2">{{ c('footer.address') }} ↗</a>
                    <dl class="mt-5 border-t border-white/[0.07] pt-4 space-y-1.5 text-xs">
                        <div v-for="r in hours" :key="r.label" class="flex justify-between gap-4"><dt class="text-steel">{{ r.label }}</dt><dd class="font-display text-[10px] tracking-wider text-white">{{ r.value }}</dd></div>
                    </dl>
                </div>
            </div>

            <div class="border-t border-white/[0.06]">
                <div class="container-x py-5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs text-steel">
                    <p>© {{ year }} MDetailing Premium Car Care · {{ t('footer.rights') }} <span class="block sm:inline sm:ml-3 text-steel/70">3D: Ferrari 458 by <a href="https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6" target="_blank" rel="noopener" class="underline hover:text-white">vicent091036</a> (CC BY)</span></p>
                    <button type="button" class="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.25em] text-white hover:text-signal transition-colors" @click="toTop">
                        Top <Icon name="arrow-up-right" :size="13" class="-rotate-45" />
                    </button>
                </div>
            </div>
            <div class="h-1.5 bg-signal"></div>
        </div>
    </footer>
</template>
