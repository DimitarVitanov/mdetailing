<template>
    <PageHero :eyebrow="c('contactPage.label')" :lines="[c('contactPage.title'), { text: c('contactPage.titleAccent'), class: 'text-signal' }]" image="gallery-06" :crumb="t('nav.contact')">
        {{ c('contactPage.subtitle') }}
    </PageHero>

    <section class="relative py-16 md:py-28">
        <div class="hex-grid absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        <div class="relative container-x grid lg:grid-cols-12 gap-12 lg:gap-16">
            <!-- ============ FORM ============ -->
            <div class="lg:col-span-7">
                <div v-if="sent" v-reveal class="min-h-[28rem] flex flex-col items-center justify-center text-center bg-ink-3 border border-signal/40 clip-cut p-10" role="status">
                    <span class="grid h-16 w-16 place-items-center bg-signal text-ink clip-hex shadow-[0_0_40px_rgb(255_198_41/0.45)]"><Icon name="check" :size="30" stroke-width="2.5" /></span>
                    <h2 class="font-display mt-8 text-2xl md:text-3xl">{{ t('contactPage.successTitle') }}</h2>
                    <p class="mt-4 max-w-md text-body">{{ sent }}</p>
                    <button type="button" @click="sent = null" class="btn-ghost mt-8">{{ t('contactPage.sendAnother') }}</button>
                </div>

                <form v-else @submit.prevent="submit" novalidate>
                    <p v-reveal class="eyebrow mb-5">{{ t('contactPage.formTitle') }}</p>
                    <MaskLines class="font-display text-3xl sm:text-5xl leading-[0.95] mb-4" :lines="[t('contactPage.details')]" />
                    <p v-reveal:100 class="text-body mb-12">{{ t('contactPage.responseNote') }}</p>

                    <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                        <label>Website <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off"></label>
                    </div>

                    <div v-reveal:150 class="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                        <div class="sm:col-span-2">
                            <label for="client_name" class="s-label">{{ t('contactPage.fullName') }} <span class="text-signal">*</span></label>
                            <input id="client_name" v-model="form.client_name" type="text" required autocomplete="name" class="s-field" :aria-invalid="!!form.errors.client_name">
                            <p v-if="form.errors.client_name" class="mt-2 text-xs text-red-400">{{ form.errors.client_name }}</p>
                        </div>
                        <div>
                            <label for="client_phone" class="s-label">{{ t('contactPage.phoneLabel') }} <span class="text-signal">*</span></label>
                            <input id="client_phone" v-model="form.client_phone" type="tel" required autocomplete="tel" inputmode="tel" placeholder="+389 7X XXX XXX" class="s-field" :aria-invalid="!!form.errors.client_phone">
                            <p v-if="form.errors.client_phone" class="mt-2 text-xs text-red-400">{{ form.errors.client_phone }}</p>
                        </div>
                        <div>
                            <label for="client_email" class="s-label">{{ t('contactPage.emailLabel') }} <span class="text-signal">*</span></label>
                            <input id="client_email" v-model="form.client_email" type="email" required autocomplete="email" inputmode="email" class="s-field" :aria-invalid="!!form.errors.client_email">
                            <p v-if="form.errors.client_email" class="mt-2 text-xs text-red-400">{{ form.errors.client_email }}</p>
                        </div>

                        <p class="sm:col-span-2 eyebrow mt-6">{{ t('contactPage.vehicle') }}</p>
                        <div>
                            <label for="vehicle_make" class="s-label">{{ t('contactPage.vehicleMake') }}</label>
                            <input id="vehicle_make" v-model="form.vehicle_make" type="text" placeholder="BMW" class="s-field" :aria-invalid="!!form.errors.vehicle_make">
                        </div>
                        <div class="grid grid-cols-2 gap-x-8">
                            <div>
                                <label for="vehicle_model" class="s-label">{{ t('contactPage.vehicleModel') }}</label>
                                <input id="vehicle_model" v-model="form.vehicle_model" type="text" placeholder="X5" class="s-field" :aria-invalid="!!form.errors.vehicle_model">
                            </div>
                            <div>
                                <label for="vehicle_year" class="s-label">{{ t('contactPage.vehicleYear') }}</label>
                                <input id="vehicle_year" v-model="form.vehicle_year" type="text" inputmode="numeric" maxlength="10" placeholder="2021" class="s-field" :aria-invalid="!!form.errors.vehicle_year">
                            </div>
                        </div>

                        <p class="sm:col-span-2 eyebrow mt-6">{{ t('contactPage.appointment') }}</p>
                        <div class="sm:col-span-2">
                            <label for="service_id" class="s-label">{{ t('contactPage.service') }}</label>
                            <select id="service_id" v-model="form.service_id" class="s-field" :aria-invalid="!!form.errors.service_id">
                                <option :value="null">{{ t('contactPage.selectService') }}</option>
                                <option v-for="s in services" :key="s.id" :value="s.id">{{ localized(s, 'name') }}</option>
                            </select>
                        </div>
                        <div>
                            <label for="preferred_date" class="s-label">{{ t('contactPage.preferredDate') }}</label>
                            <input id="preferred_date" v-model="form.preferred_date" type="date" :min="minDate" class="s-field" :aria-invalid="!!form.errors.preferred_date">
                            <p v-if="form.errors.preferred_date" class="mt-2 text-xs text-red-400">{{ form.errors.preferred_date }}</p>
                        </div>
                        <div>
                            <label for="preferred_time" class="s-label">{{ t('contactPage.preferredTime') }}</label>
                            <select id="preferred_time" v-model="form.preferred_time" class="s-field" :aria-invalid="!!form.errors.preferred_time">
                                <option :value="null">{{ t('contactPage.selectTime') }}</option>
                                <option v-for="time in times" :key="time" :value="time">{{ time }}</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label for="message" class="s-label">{{ t('contactPage.message') }}</label>
                            <textarea id="message" v-model="form.message" rows="3" maxlength="2000" class="s-field resize-y" :placeholder="t('contactPage.messagePlaceholder')" :aria-invalid="!!form.errors.message"></textarea>
                        </div>
                    </div>

                    <div v-reveal:200 class="mt-12 flex flex-col sm:flex-row sm:items-center gap-6">
                        <button type="submit" :disabled="form.processing" class="btn-signal !px-10 !py-5">
                            <svg v-if="form.processing" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                            {{ form.processing ? t('contactPage.sending') : t('contactPage.submit') }}
                        </button>
                        <p class="text-xs text-steel"><span class="text-signal">*</span> {{ t('contactPage.required') }}</p>
                    </div>
                </form>
            </div>

            <!-- ============ DETAILS ============ -->
            <aside class="lg:col-span-5 space-y-10 lg:pt-4">
                <div v-reveal>
                    <p class="s-label mb-3">{{ t('contactPage.phone') }}</p>
                    <a v-if="phone" :href="telHref(phone)" class="group inline-flex items-center gap-4 font-display text-2xl sm:text-3xl text-white hover:text-signal transition-colors">
                        <span class="grid h-12 w-12 place-items-center bg-signal text-ink clip-hex"><Icon name="phone" :size="20" /></span>{{ phone }}
                    </a>
                </div>
                <div v-if="c('footer.email')" v-reveal:100>
                    <p class="s-label mb-3">{{ t('contactPage.email') }}</p>
                    <a :href="`mailto:${c('footer.email')}`" class="font-display text-lg text-white hover:text-signal transition-colors break-all">{{ c('footer.email') }}</a>
                </div>
                <div v-reveal:150>
                    <p class="s-label mb-3">{{ t('contactPage.address') }}</p>
                    <p class="font-display text-lg text-white">{{ c('footer.address') }}</p>
                    <a :href="mapsLink" target="_blank" rel="noopener" class="link-arrow mt-3">{{ t('footer.directions') }}</a>
                </div>
                <div v-reveal:200 class="relative aspect-[16/10] bg-ink-3 clip-cut overflow-hidden">
                    <iframe v-if="showMap" :src="mapEmbed" class="absolute inset-0 h-full w-full [filter:grayscale(1)_invert(0.92)_contrast(0.9)]" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen :title="c('footer.address')"></iframe>
                    <button v-else type="button" @click="showMap = true" class="group absolute inset-0 grid place-items-center" :data-cursor="t('contactPage.mapLoad')">
                        <span class="hex-grid absolute inset-0 opacity-[0.08]"></span>
                        <span class="relative flex flex-col items-center gap-4">
                            <span class="led-pulse grid h-14 w-14 place-items-center bg-signal text-ink clip-hex shadow-[0_0_40px_rgb(255_198_41/0.5)]"><Icon name="map-pin" :size="24" /></span>
                            <span class="font-display text-[10px] tracking-[0.25em] text-white">{{ t('contactPage.mapLoad') }}</span>
                        </span>
                    </button>
                </div>
                <div v-reveal:250>
                    <p class="s-label mb-3 flex items-center gap-2"><Icon name="clock" :size="14" class="text-signal" /> {{ t('contactPage.hours') }}</p>
                    <dl class="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                        <div v-for="row in hours" :key="row.label" class="flex justify-between gap-4 py-3 text-sm">
                            <dt class="text-body">{{ row.label }}</dt>
                            <dd class="font-display text-xs tracking-wider" :class="row.closed ? 'text-red-400' : 'text-white'">{{ row.value }}</dd>
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
import MaskLines from '@/Components/MaskLines.vue';
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
    ].filter((r) => r.value),
);
const mapQuery = computed(() => c('contact.mapQuery') || 'MDetailing.mk');
const mapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery.value)}`);
const mapEmbed = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&output=embed`);
const showMap = ref(false);

// "Book this service" links arrive as /contact?service=3.
const preselected = Number(new URLSearchParams((page.url || '').split('?')[1] || '').get('service')) || null;

const form = useForm({
    client_name: '', client_email: '', client_phone: '',
    vehicle_make: '', vehicle_model: '', vehicle_year: '',
    service_id: props.services.some((s) => s.id === preselected) ? preselected : null,
    preferred_date: '', preferred_time: null, message: '', website: '',
});

const minDate = ref(null);
onMounted(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    minDate.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

const sent = ref(null);
function submit() {
    form.post('/booking', {
        preserveScroll: true,
        onSuccess: (response) => { sent.value = response.props.flash?.success || t('contactPage.successTitle'); form.reset(); },
        onError: () => {
            const first = document.querySelector('[aria-invalid="true"]');
            first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            first?.focus({ preventScroll: true });
        },
    });
}
watch(() => ({ ...form.data() }), (now, before) => { for (const k of Object.keys(now)) if (now[k] !== before?.[k]) form.clearErrors(k); });
</script>
