<template>
    <AdminLayout title="Site Content">
        <Head title="Site Content" />

        <div class="space-y-8">
            <div v-for="(items, page) in contents" :key="page" class="bg-gray-800/50 border border-white/5 rounded-xl overflow-hidden">
                <div class="p-5 border-b border-white/5 flex items-center justify-between">
                    <h2 class="text-lg font-semibold capitalize">{{ page }} Page</h2>
                    <span class="text-xs text-gray-400 bg-gray-700/50 px-2.5 py-1 rounded-full">{{ items.length }} items</span>
                </div>
                <div class="divide-y divide-white/5">
                    <div v-for="item in items" :key="item.id" class="p-5 hover:bg-white/[0.02] transition-colors">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded">{{ item.key }}</span>
                                    <span class="text-xs text-gray-500">{{ item.section }}</span>
                                </div>
                                <p class="text-sm text-white truncate">{{ item.value_en || '—' }}</p>
                                <p class="text-xs text-gray-400 truncate mt-0.5">{{ item.value_mk || '—' }}</p>
                            </div>
                            <Link :href="'/admin/content/' + item.id + '/edit'"
                                  class="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gold border border-gold/20 rounded-lg hover:bg-gold/10 transition-colors">
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps({
    contents: Object,
});
</script>
