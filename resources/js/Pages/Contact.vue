<template>
    <MainLayout>
        <Head :title="t('contactPage.label')" />

        <section class="pt-32 pb-16 bg-gradient-to-b from-black to-dark relative">
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.3) 0%, transparent 50%);"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <span class="text-gold text-sm font-semibold tracking-widest uppercase">{{ c('contactPage.label') }}</span>
                <h1 class="text-4xl lg:text-6xl font-black mt-3 mb-4">{{ c('contactPage.title') }} <span class="text-gold">{{ c('contactPage.titleAccent') }}</span></h1>
                <p class="text-gray-light text-lg max-w-2xl mx-auto">{{ c('contactPage.subtitle') }}</p>
            </div>
        </section>

        <section class="py-20 bg-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <!-- Contact Info -->
                    <div class="space-y-8">
                        <div>
                            <h3 class="text-xl font-bold mb-6">{{ t('contactPage.contactInfo') }}</h3>
                            <div class="space-y-4">
                                <div class="flex items-start space-x-4">
                                    <div class="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-gray-light text-sm">{{ t('contactPage.phone') }}</p>
                                        <p class="text-white font-medium">{{ c('footer.phone') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start space-x-4">
                                    <div class="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-gray-light text-sm">{{ t('contactPage.email') }}</p>
                                        <p class="text-white font-medium">{{ c('footer.email') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start space-x-4">
                                    <div class="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-gray-light text-sm">{{ t('contactPage.address') }}</p>
                                        <p class="text-white font-medium">{{ c('footer.address') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-xl font-bold mb-4">{{ t('contactPage.hours') }}</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between"><span class="text-gray-light">{{ t('contactPage.monFri') }}</span><span class="text-white">{{ c('contactPage.hours.monFri') }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-light">{{ t('contactPage.saturday') }}</span><span class="text-white">{{ c('contactPage.hours.saturday') }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-light">{{ t('contactPage.sunday') }}</span><span class="text-red-400">{{ c('contactPage.hours.sunday') }}</span></div>
                            </div>
                        </div>
                    </div>

                    <!-- Form -->
                    <div class="lg:col-span-2">
                        <form @submit.prevent="submitBooking" class="bg-gray-dark/50 border border-white/5 rounded-2xl p-8">
                            <h3 class="text-xl font-bold mb-6">{{ t('contactPage.formTitle') }}</h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.fullName') }} *</label>
                                    <input v-model="form.client_name" type="text" required
                                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                           placeholder="John Doe">
                                    <p v-if="form.errors.client_name" class="text-red-400 text-xs mt-1">{{ form.errors.client_name }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.emailLabel') }} *</label>
                                    <input v-model="form.client_email" type="email" required
                                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                           placeholder="john@example.com">
                                    <p v-if="form.errors.client_email" class="text-red-400 text-xs mt-1">{{ form.errors.client_email }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.phoneLabel') }} *</label>
                                    <input v-model="form.client_phone" type="tel" required
                                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                           placeholder="(555) 123-4567">
                                    <p v-if="form.errors.client_phone" class="text-red-400 text-xs mt-1">{{ form.errors.client_phone }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.service') }}</label>
                                    <select v-model="form.service_id"
                                            class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                                        <option :value="null">{{ t('contactPage.selectService') }}</option>
                                        <option v-for="s in services" :key="s.id" :value="s.id">{{ localized(s, 'name') }}</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.vehicleMake') }}</label>
                                    <input v-model="form.vehicle_make" type="text"
                                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                           placeholder="e.g. BMW">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.vehicleModel') }}</label>
                                    <input v-model="form.vehicle_model" type="text"
                                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                           placeholder="e.g. M5">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.preferredDate') }}</label>
                                    <input v-model="form.preferred_date" type="date"
                                           class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.preferredTime') }}</label>
                                    <select v-model="form.preferred_time"
                                            class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors">
                                        <option :value="null">{{ t('contactPage.selectTime') }}</option>
                                        <option value="08:00">8:00 AM</option>
                                        <option value="09:00">9:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="14:00">2:00 PM</option>
                                        <option value="15:00">3:00 PM</option>
                                        <option value="16:00">4:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium text-gray-light mb-2">{{ t('contactPage.message') }}</label>
                                <textarea v-model="form.message" rows="4"
                                          class="w-full bg-gray-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"
                                          :placeholder="t('contactPage.messagePlaceholder')"></textarea>
                            </div>

                            <button type="submit" :disabled="form.processing"
                                    class="mt-6 w-full px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark font-bold rounded-xl hover:shadow-2xl hover:shadow-gold/25 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="form.processing">{{ t('contactPage.sending') }}</span>
                                <span v-else>{{ t('contactPage.submit') }}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { Head } from '@inertiajs/vue3';
import { useForm } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import { useI18n } from '@/i18n.js';

const { t, c, localized } = useI18n();

const props = defineProps({ services: Array });

const form = useForm({
    client_name: '',
    client_email: '',
    client_phone: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    service_id: null,
    preferred_date: '',
    preferred_time: null,
    message: '',
});

const submitBooking = () => {
    form.post('/booking', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
</script>
