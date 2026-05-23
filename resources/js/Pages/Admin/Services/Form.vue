<template>
    <AdminLayout :title="service ? 'Edit Service' : 'Create Service'">
        <Head :title="service ? 'Edit Service' : 'Create Service'" />

        <div class="max-w-3xl">
            <Link href="/admin/services" class="inline-flex items-center space-x-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                <span>Back to Services</span>
            </Link>

            <form @submit.prevent="submit" class="bg-gray-800/50 border border-white/5 rounded-xl p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Service Name (EN) *</label>
                        <input v-model="form.name" type="text" required
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                        <p v-if="form.errors.name" class="text-red-400 text-xs mt-1">{{ form.errors.name }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Име на Услуга (MK)</label>
                        <input v-model="form.name_mk" type="text"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Short Description (EN) *</label>
                        <input v-model="form.short_description" type="text" required
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                        <p v-if="form.errors.short_description" class="text-red-400 text-xs mt-1">{{ form.errors.short_description }}</p>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Краток Опис (MK)</label>
                        <input v-model="form.short_description_mk" type="text"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Full Description (EN) *</label>
                        <textarea v-model="form.description" rows="5" required
                                  class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"></textarea>
                        <p v-if="form.errors.description" class="text-red-400 text-xs mt-1">{{ form.errors.description }}</p>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Целосен Опис (MK)</label>
                        <textarea v-model="form.description_mk" rows="5"
                                  class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Price From *</label>
                        <input v-model="form.price_from" type="number" step="0.01" required
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Price To</label>
                        <input v-model="form.price_to" type="number" step="0.01"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                        <input v-model="form.duration" type="text" placeholder="e.g. 2-3 hours"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                        <input v-model="form.sort_order" type="number"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Image</label>
                        <input type="file" @input="form.image = $event.target.files[0]" accept="image/*"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gold/20 file:text-gold file:text-sm">
                    </div>

                    <div class="flex items-center space-x-6 pt-6">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 bg-gray-900 border-white/20 rounded text-gold focus:ring-gold">
                            <span class="text-sm text-gray-300">Active</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 bg-gray-900 border-white/20 rounded text-gold focus:ring-gold">
                            <span class="text-sm text-gray-300">Featured</span>
                        </label>
                    </div>
                </div>

                <div class="flex items-center space-x-4 pt-4 border-t border-white/5">
                    <button type="submit" :disabled="form.processing"
                            class="px-6 py-2.5 bg-gold text-dark font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
                        {{ service ? 'Update Service' : 'Create Service' }}
                    </button>
                    <Link href="/admin/services" class="px-6 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">Cancel</Link>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({ service: Object });

const form = useForm({
    name: props.service?.name || '',
    name_mk: props.service?.name_mk || '',
    short_description: props.service?.short_description || '',
    short_description_mk: props.service?.short_description_mk || '',
    description: props.service?.description || '',
    description_mk: props.service?.description_mk || '',
    price_from: props.service?.price_from || '',
    price_to: props.service?.price_to || '',
    duration: props.service?.duration || '',
    icon: props.service?.icon || '',
    image: null,
    sort_order: props.service?.sort_order || 0,
    is_featured: props.service?.is_featured || false,
    is_active: props.service?.is_active ?? true,
});

const submit = () => {
    if (props.service) {
        form.post('/admin/services/' + props.service.id, {
            forceFormData: true,
            preserveScroll: true,
        });
    } else {
        form.post('/admin/services', { forceFormData: true });
    }
};
</script>
