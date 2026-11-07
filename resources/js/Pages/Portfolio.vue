<template>
    <PageHero :eyebrow="c('portfolioPage.label')" :lines="[c('portfolioPage.title'), { text: c('portfolioPage.titleAccent'), class: 'text-signal' }]" image="gallery-02" :crumb="t('nav.portfolio')">
        {{ c('portfolioPage.subtitle') }}
    </PageHero>

    <section class="relative py-16 md:py-24">
        <div class="container-x">
            <div v-if="categories.length" v-reveal class="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 mb-12" role="group">
                <button v-for="cat in [null, ...categories]" :key="cat ?? 'all'" type="button" @click="active = cat" class="shrink-0 font-display text-[10px] tracking-[0.2em] px-5 py-3 clip-cut-sm transition-colors" :class="active === cat ? 'bg-signal text-ink' : 'bg-white/[0.04] text-body hover:text-white'" :aria-pressed="active === cat">
                    {{ cat ?? t('portfolioPage.all') }} <span class="opacity-50 ml-1">{{ count(cat) }}</span>
                </button>
            </div>

            <ParallaxGallery :key="active ?? 'all'" :items="gallery" :cursor="t('portfolioPage.compare')" @open="open" />
            <p v-if="!filtered.length" class="py-24 text-center text-body">{{ t('portfolioPage.noItems') }}</p>
        </div>
    </section>

    <!-- ============ LIGHTBOX (client-only: a server-rendered Teleport can't be hydrated) ============ -->
    <Teleport v-if="hydrated" to="body">
        <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0">
            <div v-if="current" class="fixed inset-0 z-[100] flex flex-col bg-ink/[0.98]" role="dialog" aria-modal="true" :aria-label="localized(current, 'title')" @touchstart.passive="touchStart" @touchend.passive="touchEnd">
                <div class="flex items-start justify-between gap-4 p-4 md:p-6">
                    <div class="min-w-0">
                        <p class="font-display text-[10px] tracking-[0.25em] text-steel">{{ String(index + 1).padStart(2, '0') }} / {{ String(filtered.length).padStart(2, '0') }}<span v-if="current.category" class="text-signal"> · {{ current.category }}</span></p>
                        <h2 class="mt-2 truncate font-display text-base md:text-2xl text-white">{{ localized(current, 'title') }}</h2>
                    </div>
                    <button ref="closeButton" type="button" @click="close" class="grid h-11 w-11 shrink-0 place-items-center border border-white/15 text-white hover:border-signal hover:text-signal clip-cut-sm" :aria-label="t('portfolioPage.close')"><Icon name="close" :size="20" /></button>
                </div>
                <div class="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
                    <CompareSlider v-if="current.before_image && current.after_image" :key="current.id" class="w-full max-w-5xl" :before="upload(current.before_image)" :after="upload(current.after_image)" :alt="localized(current, 'title')" :before-label="t('portfolioPage.before')" :after-label="t('portfolioPage.after')" :hint="t('portfolioPage.compare')" />
                    <img v-else :key="current.id" v-bind="imageFor(current.after_image || current.before_image, portfolioPhoto(current))" sizes="100vw" :alt="localized(current, 'title')" class="max-h-full max-w-full object-contain clip-cut" />
                    <template v-if="filtered.length > 1">
                        <button type="button" @click="step(-1)" class="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/15 text-white hover:border-signal hover:text-signal md:grid clip-cut-sm" :aria-label="t('portfolioPage.prev')"><Icon name="chevron-left" :size="22" /></button>
                        <button type="button" @click="step(1)" class="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/15 text-white hover:border-signal hover:text-signal md:grid clip-cut-sm" :aria-label="t('portfolioPage.next')"><Icon name="chevron-right" :size="22" /></button>
                    </template>
                </div>
                <div class="flex items-center justify-between gap-4 p-4 md:p-6">
                    <p class="line-clamp-2 max-w-3xl text-sm text-body">{{ localized(current, 'description') }}</p>
                    <div v-if="filtered.length > 1" class="flex shrink-0 gap-2 md:hidden">
                        <button type="button" @click="step(-1)" class="grid h-11 w-11 place-items-center border border-white/15 text-white clip-cut-sm" :aria-label="t('portfolioPage.prev')"><Icon name="chevron-left" :size="20" /></button>
                        <button type="button" @click="step(1)" class="grid h-11 w-11 place-items-center border border-white/15 text-white clip-cut-sm" :aria-label="t('portfolioPage.next')"><Icon name="chevron-right" :size="20" /></button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import CompareSlider from '@/Components/CompareSlider.vue';
import Icon from '@/Components/Icon.vue';
import PageHero from '@/Components/PageHero.vue';
import ParallaxGallery from '@/Components/ParallaxGallery.vue';
import { useI18n } from '@/i18n.js';
import { imageFor, portfolioPhoto, upload } from '@/lib/img.js';
import { lockScroll } from '@/lib/motion.js';

defineOptions({ layout: MainLayout });

const props = defineProps({
    items: { type: Array, default: () => [] },
    categories: { type: Array, default: () => [] },
});

const { t, c, localized } = useI18n();

const active = ref(null);
const filtered = computed(() => (active.value ? props.items.filter((i) => i.category === active.value) : props.items));
const count = (cat) => (cat ? props.items.filter((i) => i.category === cat).length : props.items.length);
const gallery = computed(() => filtered.value.map((item) => ({ image: imageFor(item.after_image || item.before_image, portfolioPhoto(item)), alt: localized(item, 'title'), label: localized(item, 'title'), category: item.category })));

// ── Lightbox ──
const hydrated = ref(false);
onMounted(() => (hydrated.value = true));
const index = ref(-1);
const current = computed(() => filtered.value[index.value] ?? null);
const closeButton = ref(null);

function open(i) {
    index.value = i;
    lockScroll(true);
    window.addEventListener('keydown', onKey);
    nextTick(() => closeButton.value?.focus());
}
function close() {
    index.value = -1;
    lockScroll(false);
    window.removeEventListener('keydown', onKey);
}
function step(d) {
    const n = filtered.value.length;
    index.value = (index.value + d + n) % n;
}
function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
}
let startX = null;
function touchStart(e) { startX = e.target.closest('input[type=range]') ? null : e.changedTouches[0].clientX; }
function touchEnd(e) {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    startX = null;
}
onUnmounted(() => { if (index.value >= 0) close(); });
</script>
