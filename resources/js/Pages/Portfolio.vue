<template>
    <MainLayout>
        <Head :title="t('portfolioPage.title')" />

        <section class="pt-32 pb-16 bg-gradient-to-b from-black to-dark relative">
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.3) 0%, transparent 50%);"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <span class="text-gold text-sm font-semibold tracking-widest uppercase">{{ c('portfolioPage.label') }}</span>
                <h1 class="text-4xl lg:text-6xl font-black mt-3 mb-4">{{ c('portfolioPage.title') }} <span class="text-gold">{{ c('portfolioPage.titleAccent') }}</span></h1>
                <p class="text-gray-light text-lg max-w-2xl mx-auto">{{ c('portfolioPage.subtitle') }}</p>
            </div>
        </section>

        <section class="py-20 bg-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Filter -->
                <div v-if="categories.length" class="flex flex-wrap justify-center gap-3 mb-12">
                    <button @click="activeCategory = null"
                            class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                            :class="!activeCategory ? 'bg-gold text-dark' : 'bg-gray-dark text-gray-light hover:text-white border border-white/10'">
                        {{ t('portfolioPage.all') }}
                    </button>
                    <button v-for="cat in categories" :key="cat"
                            @click="activeCategory = cat"
                            class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                            :class="activeCategory === cat ? 'bg-gold text-dark' : 'bg-gray-dark text-gray-light hover:text-white border border-white/10'">
                        {{ cat }}
                    </button>
                </div>

                <!-- Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <transition-group name="portfolio">
                        <div v-for="item in filteredItems" :key="item.id"
                             class="group relative overflow-hidden rounded-2xl bg-gray-dark cursor-pointer hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
                             @click="openModal(item)">
                            <div class="aspect-[4/3] relative overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                <div v-if="item.after_image" class="w-full h-full">
                                    <img :src="'/storage/' + item.after_image" :alt="item.title" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"/>
                                </div>
                                <div v-else class="w-full h-full bg-gradient-to-br from-gray-dark to-gray-medium flex items-center justify-center">
                                    <svg class="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>

                                <!-- Hover overlay -->
                                <div class="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                    <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                                    </div>
                                </div>

                                <div class="absolute bottom-0 left-0 right-0 p-6 z-20">
                                    <h3 class="text-white font-bold text-lg">{{ localized(item, 'title') }}</h3>
                                    <p v-if="item.category" class="text-gold text-sm mt-1">{{ item.category }}</p>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </div>

                <p v-if="!filteredItems.length" class="text-center text-gray-light py-20">{{ t('portfolioPage.noItems') }}</p>
            </div>
        </section>

        <!-- Modal -->
        <transition
            enter-active-class="transition duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="modalItem" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" @click.self="modalItem = null">
                <div class="bg-gray-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 flex items-center justify-between border-b border-white/5">
                        <h3 class="text-xl font-bold">{{ localized(modalItem, 'title') }}</h3>
                        <button @click="modalItem = null" class="text-gray-light hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div v-if="modalItem.before_image && modalItem.after_image" class="grid grid-cols-2 gap-4 p-6">
                        <div>
                            <span class="text-xs text-gray-light uppercase tracking-wider mb-2 block">{{ t('portfolioPage.before') }}</span>
                            <img :src="'/storage/' + modalItem.before_image" :alt="'Before - ' + modalItem.title" class="w-full rounded-lg"/>
                        </div>
                        <div>
                            <span class="text-xs text-gold uppercase tracking-wider mb-2 block">{{ t('portfolioPage.after') }}</span>
                            <img :src="'/storage/' + modalItem.after_image" :alt="'After - ' + modalItem.title" class="w-full rounded-lg"/>
                        </div>
                    </div>
                    <div v-else-if="modalItem.after_image" class="p-6">
                        <img :src="'/storage/' + modalItem.after_image" :alt="modalItem.title" class="w-full rounded-lg"/>
                    </div>
                    <div v-if="modalItem.description" class="px-6 pb-6 text-gray-light text-sm leading-relaxed">
                        {{ localized(modalItem, 'description') }}
                    </div>
                </div>
            </div>
        </transition>
    </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Link, Head } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import { useI18n } from '@/i18n.js';

const { t, c, localized } = useI18n();

const props = defineProps({
    items: Array,
    categories: Array,
});

const activeCategory = ref(null);
const modalItem = ref(null);

const filteredItems = computed(() => {
    if (!activeCategory.value) return props.items;
    return props.items.filter(item => item.category === activeCategory.value);
});

const openModal = (item) => {
    modalItem.value = item;
};
</script>

<style scoped>
.portfolio-enter-active, .portfolio-leave-active {
    transition: all 0.4s ease;
}
.portfolio-enter-from, .portfolio-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
