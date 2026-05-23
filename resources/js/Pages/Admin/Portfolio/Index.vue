<template>
    <AdminLayout title="Portfolio">
        <Head title="Manage Portfolio" />

        <div class="flex items-center justify-between mb-6">
            <p class="text-gray-400 text-sm">Manage your portfolio gallery</p>
            <Link href="/admin/portfolio/create" class="px-4 py-2 bg-gold text-dark font-semibold rounded-lg text-sm hover:bg-gold-light transition-colors">
                + Add Item
            </Link>
        </div>

        <div class="bg-gray-800/50 border border-white/5 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/5">
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Item</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Category</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Service</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                            <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id" class="border-b border-white/5 hover:bg-white/[0.02]">
                            <td class="px-5 py-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                        <img v-if="item.after_image" :src="'/storage/' + item.after_image" class="w-full h-full object-cover"/>
                                        <div v-else class="w-full h-full flex items-center justify-center">
                                            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        </div>
                                    </div>
                                    <span class="text-sm font-medium text-white">{{ item.title }}</span>
                                </div>
                            </td>
                            <td class="px-5 py-4 text-sm text-gray-300">{{ item.category || '-' }}</td>
                            <td class="px-5 py-4 text-sm text-gray-300">{{ item.service?.name || '-' }}</td>
                            <td class="px-5 py-4">
                                <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                                      :class="item.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
                                    {{ item.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-right space-x-2">
                                <Link :href="'/admin/portfolio/' + item.id + '/edit'" class="text-blue-400 hover:text-blue-300 text-sm">Edit</Link>
                                <button @click="deleteItem(item)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
                            </td>
                        </tr>
                        <tr v-if="!items.length">
                            <td colspan="5" class="px-5 py-8 text-center text-gray-400 text-sm">No portfolio items yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps({ items: Array });

const deleteItem = (item) => {
    if (confirm(`Delete "${item.title}"?`)) {
        router.delete('/admin/portfolio/' + item.id);
    }
};
</script>
