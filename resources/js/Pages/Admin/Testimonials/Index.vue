<template>
    <AdminLayout title="Testimonials">
        <Head title="Manage Testimonials" />

        <div class="flex items-center justify-between mb-6">
            <p class="text-gray-400 text-sm">Manage client testimonials</p>
            <Link href="/admin/testimonials/create" class="px-4 py-2 bg-gold text-dark font-semibold rounded-lg text-sm hover:bg-gold-light transition-colors">
                + Add Testimonial
            </Link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="t in testimonials" :key="t.id"
                 class="bg-gray-800/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-colors">
                <div class="flex space-x-1 mb-3">
                    <svg v-for="star in t.rating" :key="star" class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">"{{ t.content }}"</p>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white text-sm font-medium">{{ t.client_name }}</p>
                        <p v-if="t.client_vehicle" class="text-gray-400 text-xs">{{ t.client_vehicle }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                              :class="t.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
                            {{ t.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                </div>
                <div class="mt-4 pt-3 border-t border-white/5 flex space-x-3">
                    <Link :href="'/admin/testimonials/' + t.id + '/edit'" class="text-blue-400 hover:text-blue-300 text-xs">Edit</Link>
                    <button @click="deleteTestimonial(t)" class="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </div>
            </div>
        </div>

        <p v-if="!testimonials.length" class="text-center text-gray-400 py-12 text-sm">No testimonials yet.</p>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps({ testimonials: Array });

const deleteTestimonial = (t) => {
    if (confirm(`Delete testimonial from "${t.client_name}"?`)) {
        router.delete('/admin/testimonials/' + t.id);
    }
};
</script>
