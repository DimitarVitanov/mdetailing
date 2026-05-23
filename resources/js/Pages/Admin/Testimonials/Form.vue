<template>
    <AdminLayout :title="testimonial ? 'Edit Testimonial' : 'Add Testimonial'">
        <Head :title="testimonial ? 'Edit Testimonial' : 'Add Testimonial'" />

        <div class="max-w-2xl">
            <Link href="/admin/testimonials" class="inline-flex items-center space-x-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                <span>Back to Testimonials</span>
            </Link>

            <form @submit.prevent="submit" class="bg-gray-800/50 border border-white/5 rounded-xl p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Client Name *</label>
                        <input v-model="form.client_name" type="text" required class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Client Vehicle</label>
                        <input v-model="form.client_vehicle" type="text" placeholder="e.g. 2023 BMW M5" class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Testimonial Content *</label>
                    <textarea v-model="form.content" rows="4" required class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <div class="flex space-x-2">
                        <button v-for="star in 5" :key="star" type="button" @click="form.rating = star"
                                class="text-2xl transition-colors" :class="star <= form.rating ? 'text-gold' : 'text-gray-600'">
                            &#9733;
                        </button>
                    </div>
                </div>

                <div class="flex items-center space-x-6">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input v-model="form.is_active" type="checkbox" class="w-4 h-4 bg-gray-900 border-white/20 rounded text-gold focus:ring-gold">
                        <span class="text-sm text-gray-300">Active</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 bg-gray-900 border-white/20 rounded text-gold focus:ring-gold">
                        <span class="text-sm text-gray-300">Featured</span>
                    </label>
                </div>

                <div class="flex items-center space-x-4 pt-4 border-t border-white/5">
                    <button type="submit" :disabled="form.processing"
                            class="px-6 py-2.5 bg-gold text-dark font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
                        {{ testimonial ? 'Update' : 'Create' }}
                    </button>
                    <Link href="/admin/testimonials" class="px-6 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">Cancel</Link>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({ testimonial: Object });

const form = useForm({
    client_name: props.testimonial?.client_name || '',
    client_vehicle: props.testimonial?.client_vehicle || '',
    content: props.testimonial?.content || '',
    rating: props.testimonial?.rating || 5,
    is_featured: props.testimonial?.is_featured || false,
    is_active: props.testimonial?.is_active ?? true,
});

const submit = () => {
    if (props.testimonial) {
        form.put('/admin/testimonials/' + props.testimonial.id);
    } else {
        form.post('/admin/testimonials');
    }
};
</script>
