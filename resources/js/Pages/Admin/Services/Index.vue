<template>
    <AdminLayout title="Services">
        <Head title="Manage Services" />

        <div class="flex items-center justify-between mb-6">
            <p class="text-gray-400 text-sm">Manage your detailing services</p>
            <Link href="/admin/services/create" class="px-4 py-2 bg-gold text-dark font-semibold rounded-lg text-sm hover:bg-gold-light transition-colors">
                + Add Service
            </Link>
        </div>

        <div class="bg-gray-800/50 border border-white/5 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/5">
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Service</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Price</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Featured</th>
                            <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in services" :key="service.id" class="border-b border-white/5 hover:bg-white/[0.02]">
                            <td class="px-5 py-4">
                                <p class="text-sm font-medium text-white">{{ service.name }}</p>
                                <p class="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{{ service.short_description }}</p>
                            </td>
                            <td class="px-5 py-4 text-sm text-gold font-medium">
                                €{{ service.price_from }}<span v-if="service.price_to"> - €{{ service.price_to }}</span>
                            </td>
                            <td class="px-5 py-4">
                                <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                                      :class="service.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
                                    {{ service.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <span v-if="service.is_featured" class="text-gold text-xs">&#9733; Featured</span>
                                <span v-else class="text-gray-500 text-xs">-</span>
                            </td>
                            <td class="px-5 py-4 text-right space-x-2">
                                <Link :href="'/admin/services/' + service.id + '/edit'" class="text-blue-400 hover:text-blue-300 text-sm">Edit</Link>
                                <button @click="deleteService(service)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
                            </td>
                        </tr>
                        <tr v-if="!services.length">
                            <td colspan="5" class="px-5 py-8 text-center text-gray-400 text-sm">No services yet. Create your first one!</td>
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

defineProps({ services: Array });

const deleteService = (service) => {
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
        router.delete('/admin/services/' + service.id);
    }
};
</script>
