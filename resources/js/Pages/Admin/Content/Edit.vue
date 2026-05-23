<template>
    <AdminLayout title="Edit Content">
        <Head title="Edit Content" />

        <div class="max-w-3xl">
            <Link href="/admin/content" class="inline-flex items-center space-x-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                <span>Back to Content</span>
            </Link>

            <form @submit.prevent="submit" class="bg-gray-800/50 border border-white/5 rounded-xl p-6 space-y-6">
                <div class="flex items-center gap-3 pb-4 border-b border-white/5">
                    <span class="text-sm font-mono text-gold bg-gold/10 px-3 py-1 rounded-lg">{{ content.key }}</span>
                    <span class="text-xs text-gray-400 capitalize">{{ content.page }} / {{ content.section }}</span>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">English (EN)</label>
                    <textarea v-if="content.type === 'textarea' || content.type === 'html'"
                              v-model="form.value_en" rows="4"
                              class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"></textarea>
                    <input v-else v-model="form.value_en" type="text"
                           class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Македонски (MK)</label>
                    <textarea v-if="content.type === 'textarea' || content.type === 'html'"
                              v-model="form.value_mk" rows="4"
                              class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"></textarea>
                    <input v-else v-model="form.value_mk" type="text"
                           class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                </div>

                <div class="flex items-center space-x-4 pt-4 border-t border-white/5">
                    <button type="submit" :disabled="form.processing"
                            class="px-6 py-2.5 bg-gold text-dark font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
                        Save Changes
                    </button>
                    <Link href="/admin/content" class="px-6 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">Cancel</Link>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({ content: Object });

const form = useForm({
    value_en: props.content.value_en || '',
    value_mk: props.content.value_mk || '',
});

const submit = () => {
    form.post('/admin/content/' + props.content.id);
};
</script>
