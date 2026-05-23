<template>
    <AdminLayout title="Change Password">
        <div class="max-w-lg">
            <div class="bg-gray-800/50 rounded-xl border border-white/5 p-6">
                <h2 class="text-lg font-semibold text-white mb-6">Change Password</h2>

                <form @submit.prevent="submit" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1.5">Current Password</label>
                        <input v-model="form.current_password" type="password"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition" />
                        <p v-if="form.errors.current_password" class="text-red-400 text-xs mt-1">{{ form.errors.current_password }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
                        <input v-model="form.password" type="password"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition" />
                        <p v-if="form.errors.password" class="text-red-400 text-xs mt-1">{{ form.errors.password }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1.5">Confirm New Password</label>
                        <input v-model="form.password_confirmation" type="password"
                               class="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition" />
                    </div>

                    <div class="flex items-center justify-between pt-2">
                        <button type="submit" :disabled="form.processing"
                                class="px-6 py-2.5 bg-gold text-dark font-semibold rounded-lg text-sm hover:bg-gold-light transition-colors disabled:opacity-50">
                            {{ form.processing ? 'Saving...' : 'Update Password' }}
                        </button>
                        <span v-if="form.recentlySuccessful" class="text-green-400 text-sm">Saved!</span>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

function submit() {
    form.put('/admin/password', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
}
</script>
