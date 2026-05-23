<template>
    <div class="min-h-screen bg-dark flex items-center justify-center px-4">
        <Head title="Admin Login" />

        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span class="text-dark font-black text-2xl">L</span>
                </div>
                <h1 class="text-2xl font-bold">Admin Login</h1>
                <p class="text-gray-light text-sm mt-1">Sign in to manage your website</p>
            </div>

            <form @submit.prevent="submit" class="bg-gray-dark/50 border border-white/5 rounded-2xl p-8 space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-light mb-2">Email Address</label>
                    <input v-model="form.email" type="email" required autofocus
                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                           placeholder="admin@example.com">
                    <p v-if="form.errors.email" class="text-red-400 text-xs mt-1">{{ form.errors.email }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-light mb-2">Password</label>
                    <input v-model="form.password" type="password" required
                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                           placeholder="••••••••">
                    <p v-if="form.errors.password" class="text-red-400 text-xs mt-1">{{ form.errors.password }}</p>
                </div>

                <div class="flex items-center">
                    <input v-model="form.remember" type="checkbox" id="remember"
                           class="w-4 h-4 bg-gray-dark border border-white/20 rounded text-gold focus:ring-gold">
                    <label for="remember" class="ml-2 text-sm text-gray-light">Remember me</label>
                </div>

                <button type="submit" :disabled="form.processing"
                        class="w-full px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 disabled:opacity-50">
                    <span v-if="form.processing">Signing in...</span>
                    <span v-else>Sign In</span>
                </button>
            </form>

            <div class="text-center mt-6">
                <Link href="/" class="text-gray-light text-sm hover:text-gold transition-colors">&larr; Back to website</Link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3';

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post('/login', {
        onFinish: () => form.reset('password'),
    });
};
</script>
