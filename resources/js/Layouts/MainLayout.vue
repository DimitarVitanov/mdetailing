<template>
    <!-- Head tags come from the `seo` prop (app/Support/Seo.php). The root template prints the
         same tags with the same keys on the first load, so this takes them over in place. -->
    <Head v-if="seo" :title="seo.title">
        <component :is="tag.tag" v-for="tag in seo.tags" :key="tag.key" v-bind="tag.attrs" :head-key="tag.key" />
        <component :is="'script'" v-if="seo.schema" type="application/ld+json" head-key="schema">{{ seo.schema }}</component>
    </Head>

    <a href="#main" class="sr-only z-[100] bg-signal px-5 py-3 font-display text-xs text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{{ t('nav.skip') }}</a>

    <div class="relative min-h-screen bg-ink">
        <SiteHeader />
        <main id="main">
            <slot />
        </main>
        <SiteFooter />
        <Cursor />
    </div>

    <!-- Toast for flash messages (e.g. booking sent) -->
    <div class="pointer-events-none fixed inset-x-0 top-24 z-[70] flex justify-center px-4" aria-live="polite">
        <Transition enter-active-class="transition duration-500 ease-[var(--ease-forge)]" enter-from-class="opacity-0 -translate-y-3" leave-active-class="transition duration-300" leave-to-class="opacity-0 -translate-y-3">
            <div v-if="toast" class="pointer-events-auto flex max-w-lg items-start gap-3 bg-ink-3 border border-signal/40 clip-cut px-5 py-4 shadow-2xl">
                <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-signal text-ink clip-hex"><Icon name="check" :size="13" stroke-width="3" /></span>
                <p class="text-sm leading-relaxed text-white/90">{{ toast }}</p>
                <button type="button" @click="toast = null" class="-mr-1 ml-2 text-white/50 hover:text-white" :aria-label="t('toast.close')"><Icon name="close" :size="16" /></button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import Cursor from '@/Components/Cursor.vue';
import Icon from '@/Components/Icon.vue';
import SiteFooter from '@/Components/SiteFooter.vue';
import SiteHeader from '@/Components/SiteHeader.vue';
import { useI18n } from '@/i18n.js';

const page = usePage();
const { t } = useI18n();
const seo = computed(() => page.props.seo);

// Inertia's <Head> writes the tab title on a 1 ms timer; on a busy main thread (page wipe,
// photos decoding) that can land late, so the title is also set straight away.
watch(
    () => seo.value?.title,
    (title) => { if (title && typeof document !== 'undefined') document.title = title; },
);

const toast = ref(null);
let timer;
watch(
    () => page.props.flash,
    (flash) => {
        // The contact page shows its own confirmation panel.
        if (!flash?.success || typeof window === 'undefined' || page.component === 'Contact') return;
        toast.value = flash.success;
        clearTimeout(timer);
        timer = setTimeout(() => (toast.value = null), 7000);
    },
    { immediate: true },
);
onUnmounted(() => clearTimeout(timer));
</script>
