<template>
    <AdminLayout :title="item ? 'Edit Portfolio Item' : 'Add Portfolio Item'">
        <Head :title="item ? 'Edit Portfolio Item' : 'Add Portfolio Item'" />

        <div class="max-w-3xl">
            <Link href="/admin/portfolio" class="inline-flex items-center space-x-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                <span>Back to Portfolio</span>
            </Link>

            <form @submit.prevent="submit" class="bg-gray-800/50 border border-white/5 rounded-xl p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                        <input v-model="form.title" type="text" required class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea v-model="form.description" rows="4" class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <input v-model="form.category" type="text" placeholder="e.g. Ceramic Coating" class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Service</label>
                        <select v-model="form.service_id" class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                            <option :value="null">None</option>
                            <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Before Image</label>
                        <input type="file" @input="form.before_image = $event.target.files[0]" accept="image/*"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gold/20 file:text-gold file:text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">After Image</label>
                        <input type="file" @input="form.after_image = $event.target.files[0]" accept="image/*"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gold/20 file:text-gold file:text-sm">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                        <input v-model="form.sort_order" type="number" class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
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
                        {{ item ? 'Update Item' : 'Create Item' }}
                    </button>
                    <Link href="/admin/portfolio" class="px-6 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">Cancel</Link>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({ item: Object, services: Array });

const form = useForm({
    title: props.item?.title || '',
    description: props.item?.description || '',
    before_image: null,
    after_image: null,
    category: props.item?.category || '',
    service_id: props.item?.service_id || null,
    is_featured: props.item?.is_featured || false,
    is_active: props.item?.is_active ?? true,
    sort_order: props.item?.sort_order || 0,
});

const submit = () => {
    if (props.item) {
        form.post('/admin/portfolio/' + props.item.id, { forceFormData: true });
    } else {
        form.post('/admin/portfolio', { forceFormData: true });
    }
};
</script>
