<template>
    <PageHero :label="c('portfolioPage.label')" :title="c('portfolioPage.title')" :accent="c('portfolioPage.titleAccent')"
              :subtitle="c('portfolioPage.subtitle')" image="gallery-02"
              :crumbs="[{ href: '/', label: t('footer.home') }, { href: '/portfolio', label: t('nav.portfolio') }]" />

    <section class="pb-24 md:pb-32">
        <div class="container-x">
            <!-- Filters -->
            <div v-if="categories.length" class="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" :aria-label="t('portfolioPage.label')">
                <button v-for="cat in [null, ...categories]" :key="cat ?? 'all'" type="button" @click="active = cat"
                        class="shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300"
                        :class="active === cat ? 'border-signal bg-signal text-ink' : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'"
                        :aria-pressed="active === cat">
                    {{ cat ?? t('portfolioPage.all') }}
                    <span class="ml-1 text-xs opacity-60">{{ count(cat) }}</span>
                </button>
            </div>

            <!-- Grid -->
            <TransitionGroup tag="div" name="tile" class="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
                <button v-for="(item, i) in filtered" :key="item.id" type="button" @click="open(i)"
                        class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3 text-left md:rounded-3xl">
                    <img v-bind="imageFor(item.after_image || item.before_image, portfolioPhoto(item))" sizes="(min-width: 1024px) 33vw, 50vw"
                         :alt="localized(item, 'title')" :loading="i < 6 ? 'eager' : 'lazy'" decoding="async"
                         class="h-full w-full object-cover transition-transform duration-[1.3s] ease-out-expo group-hover:scale-[1.06]" />
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/5 to-transparent"></div>
                    <span v-if="item.before_image && item.after_image" class="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 md:left-4 md:top-4">
                        {{ t('portfolioPage.before') }} / {{ t('portfolioPage.after') }}
                    </span>
                    <span class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:right-4 md:top-4">
                        <Icon name="expand" :size="15" />
                    </span>
                    <div class="absolute inset-x-0 bottom-0 p-4 md:p-6">
                        <span v-if="item.category" class="mb-2 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-signal">{{ item.category }}</span>
                        <h2 class="line-clamp-2 text-sm font-semibold text-white md:text-lg">{{ localized(item, 'title') }}</h2>
                    </div>
                </button>
            </TransitionGroup>

            <p v-if="!filtered.length" class="py-24 text-center text-white/50">{{ t('portfolioPage.noItems') }}</p>
        </div>
    </section>

    <CtaBand :title="c('cta.title1')" :accent="c('cta.titleAccent')" :text="c('cta.subtitle')"
             :button="c('cta.button')" :phone="c('footer.phone')" image="ferrari-08" />

    <!-- ═════════ Lightbox ═════════ (client-only: a server-rendered Teleport can't be hydrated by Inertia) -->
    <Teleport v-if="hydrated" to="body">
        <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0">
            <div v-if="current" class="fixed inset-0 z-[100] flex flex-col bg-ink/[0.98]" role="dialog" aria-modal="true" :aria-label="localized(current, 'title')"
                 @touchstart.passive="touchStart" @touchend.passive="touchEnd">
                <div class="flex items-start justify-between gap-4 p-4 md:p-6">
                    <div class="min-w-0">
                        <p class="text-xs text-white/55">{{ index + 1 }} / {{ filtered.length }}<span v-if="current.category"> · <span class="text-signal">{{ current.category }}</span></span></p>
                        <h2 class="mt-1 truncate font-display text-base font-semibold text-white md:text-xl">{{ localized(current, 'title') }}</h2>
                    </div>
                    <button ref="closeButton" type="button" @click="close" class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" :aria-label="t('portfolioPage.close')">
                        <Icon name="close" :size="20" />
                    </button>
                </div>

                <div class="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
                    <CompareSlider v-if="current.before_image && current.after_image" :key="current.id" class="w-full max-w-5xl"
                                   :before="upload(current.before_image)" :after="upload(current.after_image)" :alt="localized(current, 'title')"
                                   :before-label="t('portfolioPage.before')" :after-label="t('portfolioPage.after')" :hint="t('portfolioPage.compare')" />
                    <img v-else :key="current.id" v-bind="imageFor(current.after_image || current.before_image, portfolioPhoto(current))" sizes="100vw"
                         :alt="localized(current, 'title')" class="max-h-full max-w-full rounded-2xl object-contain" />

                    <template v-if="filtered.length > 1">
                        <button type="button" @click="step(-1)" class="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:grid md:left-5" :aria-label="t('portfolioPage.prev')">
                            <Icon name="chevron-left" :size="22" />
                        </button>
                        <button type="button" @click="step(1)" class="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:grid md:right-5" :aria-label="t('portfolioPage.next')">
                            <Icon name="chevron-right" :size="22" />
                        </button>
                    </template>
                </div>

                <div class="flex items-center justify-between gap-4 p-4 md:p-6">
                    <p class="line-clamp-2 max-w-3xl text-sm text-white/60">{{ localized(current, 'description') }}</p>
                    <div v-if="filtered.length > 1" class="flex shrink-0 gap-2 md:hidden">
                        <button type="button" @click="step(-1)" class="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" :aria-label="t('portfolioPage.prev')"><Icon name="chevron-left" :size="20" /></button>
                        <button type="button" @click="step(1)" class="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" :aria-label="t('portfolioPage.next')"><Icon name="chevron-right" :size="20" /></button>
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
import CtaBand from '@/Components/CtaBand.vue';
import Icon from '@/Components/Icon.vue';
import PageHero from '@/Components/PageHero.vue';
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
const filtered = computed(() => (active.value ? props.items.filter((item) => item.category === active.value) : props.items));
const count = (cat) => (cat ? props.items.filter((item) => item.category === cat).length : props.items.length);

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

function step(direction) {
    const total = filtered.value.length;
    index.value = (index.value + direction + total) % total;
}

function onKey(event) {
    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'ArrowLeft') step(-1);
}

// Swipe between photos on phones (not while dragging the before/after slider).
let startX = null;
function touchStart(event) {
    startX = event.target.closest('input[type=range]') ? null : event.changedTouches[0].clientX;
}
function touchEnd(event) {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    startX = null;
}

onUnmounted(() => {
    if (index.value >= 0) close();
});
</script>

<style scoped>
.tile-enter-active,
.tile-leave-active {
    transition: opacity 0.4s, transform 0.4s var(--ease-out-expo);
}
.tile-enter-from,
.tile-leave-to {
    opacity: 0;
    transform: scale(0.96);
}
.tile-leave-active {
    position: absolute;
    visibility: hidden;
}
</style>
