<template>
    <PageHero :label="c('contactPage.label')" :title="c('contactPage.title')" :accent="c('contactPage.titleAccent')"
              :subtitle="c('contactPage.subtitle')" image="gallery-06"
              :crumbs="[{ href: '/', label: t('footer.home') }, { href: '/contact', label: t('nav.contact') }]" />

    <section class="pb-24 md:pb-32">
        <div class="container-x grid gap-8 lg:grid-cols-12 lg:gap-10">
            <!-- ═════════ Form ═════════ -->
            <div class="lg:order-2 lg:col-span-7">
                <div class="card relative overflow-hidden p-6 sm:p-8 md:p-10">
                    <div class="led-signal absolute inset-x-10 top-0"></div>

                    <div v-if="sent" class="flex min-h-[28rem] flex-col items-center justify-center text-center" role="status">
                        <span class="grid h-16 w-16 place-items-center rounded-full bg-signal text-ink shadow-[0_0_40px_rgb(255_198_41/0.45)]">
                            <Icon name="check" :size="30" stroke-width="2.5" />
                        </span>
                        <h2 class="display mt-8 text-2xl text-white md:text-3xl">{{ t('contactPage.successTitle') }}</h2>
                        <p class="mt-4 max-w-md text-white/65">{{ sent }}</p>
                        <button type="button" @click="sent = null" class="btn btn-ghost mt-8">{{ t('contactPage.sendAnother') }}</button>
                    </div>

                    <form v-else @submit.prevent="submit" novalidate>
                        <h2 class="display text-2xl text-white md:text-3xl">{{ t('contactPage.formTitle') }}</h2>
                        <p class="mt-3 text-sm text-white/55">{{ t('contactPage.responseNote') }}</p>

                        <!-- Honeypot: hidden from people, filled in by spam bots. -->
                        <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                            <label>Website <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off"></label>
                        </div>

                        <fieldset class="mt-9">
                            <legend class="eyebrow mb-5">{{ t('contactPage.details') }}</legend>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="sm:col-span-2">
                                    <label for="client_name" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.fullName') }} <span class="text-signal">*</span></label>
                                    <input id="client_name" v-model="form.client_name" type="text" required autocomplete="name" class="field" :aria-invalid="!!form.errors.client_name" aria-describedby="client_name_error">
                                    <p v-if="form.errors.client_name" id="client_name_error" class="mt-1.5 text-xs text-red-400">{{ form.errors.client_name }}</p>
                                </div>
                                <div>
                                    <label for="client_phone" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.phoneLabel') }} <span class="text-signal">*</span></label>
                                    <input id="client_phone" v-model="form.client_phone" type="tel" required autocomplete="tel" inputmode="tel" placeholder="+389 7X XXX XXX" class="field" :aria-invalid="!!form.errors.client_phone" aria-describedby="client_phone_error">
                                    <p v-if="form.errors.client_phone" id="client_phone_error" class="mt-1.5 text-xs text-red-400">{{ form.errors.client_phone }}</p>
                                </div>
                                <div>
                                    <label for="client_email" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.emailLabel') }} <span class="text-signal">*</span></label>
                                    <input id="client_email" v-model="form.client_email" type="email" required autocomplete="email" inputmode="email" class="field" :aria-invalid="!!form.errors.client_email" aria-describedby="client_email_error">
                                    <p v-if="form.errors.client_email" id="client_email_error" class="mt-1.5 text-xs text-red-400">{{ form.errors.client_email }}</p>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="mt-9">
                            <legend class="eyebrow mb-5">{{ t('contactPage.vehicle') }}</legend>
                            <div class="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label for="vehicle_make" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.vehicleMake') }}</label>
                                    <input id="vehicle_make" v-model="form.vehicle_make" type="text" placeholder="BMW" class="field" :aria-invalid="!!form.errors.vehicle_make">
                                    <p v-if="form.errors.vehicle_make" class="mt-1.5 text-xs text-red-400">{{ form.errors.vehicle_make }}</p>
                                </div>
                                <div>
                                    <label for="vehicle_model" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.vehicleModel') }}</label>
                                    <input id="vehicle_model" v-model="form.vehicle_model" type="text" placeholder="X5" class="field" :aria-invalid="!!form.errors.vehicle_model">
                                    <p v-if="form.errors.vehicle_model" class="mt-1.5 text-xs text-red-400">{{ form.errors.vehicle_model }}</p>
                                </div>
                                <div>
                                    <label for="vehicle_year" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.vehicleYear') }}</label>
                                    <input id="vehicle_year" v-model="form.vehicle_year" type="text" inputmode="numeric" maxlength="10" placeholder="2021" class="field" :aria-invalid="!!form.errors.vehicle_year">
                                    <p v-if="form.errors.vehicle_year" class="mt-1.5 text-xs text-red-400">{{ form.errors.vehicle_year }}</p>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="mt-9">
                            <legend class="eyebrow mb-5">{{ t('contactPage.appointment') }}</legend>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="sm:col-span-2">
                                    <label for="service_id" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.service') }}</label>
                                    <select id="service_id" v-model="form.service_id" class="field" :aria-invalid="!!form.errors.service_id">
                                        <option :value="null">{{ t('contactPage.selectService') }}</option>
                                        <option v-for="s in services" :key="s.id" :value="s.id">{{ localized(s, 'name') }}</option>
                                    </select>
                                    <p v-if="form.errors.service_id" class="mt-1.5 text-xs text-red-400">{{ form.errors.service_id }}</p>
                                </div>
                                <div>
                                    <label for="preferred_date" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.preferredDate') }}</label>
                                    <input id="preferred_date" v-model="form.preferred_date" type="date" :min="minDate" class="field" :aria-invalid="!!form.errors.preferred_date" aria-describedby="preferred_date_error">
                                    <p v-if="form.errors.preferred_date" id="preferred_date_error" class="mt-1.5 text-xs text-red-400">{{ form.errors.preferred_date }}</p>
                                </div>
                                <div>
                                    <label for="preferred_time" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.preferredTime') }}</label>
                                    <select id="preferred_time" v-model="form.preferred_time" class="field" :aria-invalid="!!form.errors.preferred_time">
                                        <option :value="null">{{ t('contactPage.selectTime') }}</option>
                                        <option v-for="time in times" :key="time" :value="time">{{ time }}</option>
                                    </select>
                                    <p v-if="form.errors.preferred_time" class="mt-1.5 text-xs text-red-400">{{ form.errors.preferred_time }}</p>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="message" class="mb-2 block text-sm font-medium text-white/80">{{ t('contactPage.message') }}</label>
                                    <textarea id="message" v-model="form.message" rows="4" maxlength="2000" class="field resize-y" :placeholder="t('contactPage.messagePlaceholder')" :aria-invalid="!!form.errors.message"></textarea>
                                    <p v-if="form.errors.message" class="mt-1.5 text-xs text-red-400">{{ form.errors.message }}</p>
                                </div>
                            </div>
                        </fieldset>

                        <button type="submit" :disabled="form.processing" class="btn btn-signal mt-9 w-full !min-h-14 text-base disabled:cursor-not-allowed disabled:opacity-60">
                            <svg v-if="form.processing" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                            {{ form.processing ? t('contactPage.sending') : t('contactPage.submit') }}
                        </button>
                        <p class="mt-4 text-center text-xs text-white/55"><span class="text-signal">*</span> {{ t('contactPage.required') }}</p>
                    </form>
                </div>
            </div>

            <!-- ═════════ Details ═════════ -->
            <aside class="space-y-4 lg:order-1 lg:col-span-5">
                <a v-if="phone" :href="telHref(phone)" class="card group flex items-center gap-5 p-6 transition-colors hover:border-signal/50">
                    <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-signal text-ink"><Icon name="phone" :size="24" /></span>
                    <span class="min-w-0">
                        <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('contactPage.phone') }}</span>
                        <span class="mt-1 block font-display text-xl font-semibold text-white md:text-2xl">{{ phone }}</span>
                        <span class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-signal">{{ t('contactPage.callNow') }} <Icon name="arrow-right" :size="13" class="transition-transform group-hover:translate-x-1" /></span>
                    </span>
                </a>

                <div v-if="c('footer.email')" class="card flex items-center gap-5 p-6">
                    <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-signal"><Icon name="mail" :size="24" /></span>
                    <span class="min-w-0">
                        <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('contactPage.email') }}</span>
                        <a :href="`mailto:${c('footer.email')}`" class="mt-1 block truncate text-lg font-semibold text-white hover:text-signal">{{ c('footer.email') }}</a>
                    </span>
                </div>

                <div class="card overflow-hidden">
                    <div class="flex items-start gap-5 p-6">
                        <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-signal"><Icon name="map-pin" :size="24" /></span>
                        <span class="min-w-0">
                            <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('contactPage.address') }}</span>
                            <span class="mt-1 block text-lg font-semibold text-white">{{ c('footer.address') }}</span>
                            <a :href="mapsLink" target="_blank" rel="noopener" class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-signal">{{ t('footer.directions') }} <Icon name="arrow-up-right" :size="13" /></a>
                        </span>
                    </div>
                    <!-- The Google map (≈1 MB) only loads when asked for. -->
                    <div class="relative aspect-[16/10] border-t border-white/[0.06] bg-ink-3">
                        <iframe v-if="showMap" :src="mapEmbed" class="absolute inset-0 h-full w-full [filter:grayscale(1)_invert(0.92)_contrast(0.9)]" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen :title="c('footer.address')"></iframe>
                        <button v-else type="button" @click="showMap = true" class="group absolute inset-0 grid place-items-center overflow-hidden">
                            <span class="hex-grid absolute inset-0 opacity-90"></span>
                            <span class="relative flex flex-col items-center gap-3">
                                <span class="led-pulse grid h-14 w-14 place-items-center rounded-full bg-signal text-ink shadow-[0_0_40px_rgb(255_198_41/0.5)]"><Icon name="map-pin" :size="24" /></span>
                                <span class="rounded-full border border-white/15 bg-ink/70 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:border-signal">{{ t('contactPage.mapLoad') }}</span>
                            </span>
                        </button>
                    </div>
                </div>

                <div class="card p-6">
                    <h2 class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55"><Icon name="clock" :size="16" class="text-signal" /> {{ t('contactPage.hours') }}</h2>
                    <dl class="mt-4 divide-y divide-white/[0.06]">
                        <div v-for="row in hours" :key="row.label" class="flex justify-between gap-4 py-3 text-sm">
                            <dt class="text-white/60">{{ row.label }}</dt>
                            <dd class="font-semibold" :class="row.closed ? 'text-red-400' : 'text-white'">{{ row.value }}</dd>
                        </div>
                    </dl>
                </div>
            </aside>
        </div>
    </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import Icon from '@/Components/Icon.vue';
import PageHero from '@/Components/PageHero.vue';
import { telHref, useI18n } from '@/i18n.js';

defineOptions({ layout: MainLayout });

const props = defineProps({ services: { type: Array, default: () => [] } });

const page = usePage();
const { t, c, localized } = useI18n();

const phone = computed(() => c('footer.phone'));
const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const hours = computed(() =>
    [
        { label: t('contactPage.monFri'), value: c('contactPage.hours.monFri') },
        { label: t('contactPage.saturday'), value: c('contactPage.hours.saturday') },
        { label: t('contactPage.sunday'), value: c('contactPage.hours.sunday'), closed: true },
    ].filter((row) => row.value),
);

const mapQuery = computed(() => c('contact.mapQuery') || 'MDetailing.mk');
const mapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery.value)}`);
const mapEmbed = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&output=embed`);
const showMap = ref(false);

// "Book this service" links arrive as /contact?service=3.
const preselected = Number(new URLSearchParams((page.url || '').split('?')[1] || '').get('service')) || null;

const form = useForm({
    client_name: '',
    client_email: '',
    client_phone: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    service_id: props.services.some((s) => s.id === preselected) ? preselected : null,
    preferred_date: '',
    preferred_time: null,
    message: '',
    website: '',
});

// The earliest date the booking accepts is tomorrow (local time), set in the browser.
const minDate = ref(null);
onMounted(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    minDate.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
});

const sent = ref(null);

function submit() {
    form.post('/booking', {
        preserveScroll: true,
        onSuccess: (response) => {
            sent.value = response.props.flash?.success || t('contactPage.successTitle');
            form.reset();
        },
        onError: () => {
            // Bring the first field with an error into view.
            const first = document.querySelector('[aria-invalid="true"]');
            first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            first?.focus({ preventScroll: true });
        },
    });
}

// Clear a field's error as soon as it's edited.
watch(
    () => ({ ...form.data() }),
    (now, before) => {
        for (const key of Object.keys(now)) if (now[key] !== before?.[key]) form.clearErrors(key);
    },
);
</script>
