<template>
    <!-- ═════════ Intro ═════════ -->
    <section class="relative isolate overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div class="hex-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] opacity-80"></div>
        <div class="glow absolute -top-48 left-0 -z-10 h-[34rem] w-[56rem] max-w-[200%]"></div>

        <div class="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
                <nav aria-label="Breadcrumb" class="rise flex flex-wrap items-center gap-2 text-xs text-white/50">
                    <Link href="/" class="transition-colors hover:text-white">{{ t('footer.home') }}</Link>
                    <Icon name="chevron-right" :size="12" />
                    <Link href="/services" class="transition-colors hover:text-white">{{ t('nav.services') }}</Link>
                    <Icon name="chevron-right" :size="12" />
                    <span class="text-white/75" aria-current="page">{{ name }}</span>
                </nav>

                <span v-if="service.is_featured" class="rise mt-8 inline-flex rounded-full bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{{ t('services.popular') }}</span>
                <h1 class="display chrome slide mt-5 text-[clamp(2.1rem,5.2vw,4.2rem)]">{{ name }}</h1>
                <p class="slide mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg" style="--d: 60ms">{{ localized(service, 'short_description') }}</p>

                <div class="rise mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]" style="--d: 180ms">
                    <div class="bg-ink-2 p-5">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('serviceDetailPage.price') }}</p>
                        <p class="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
                            <span class="text-sm font-normal text-white/50">{{ t('services.from') }}</span> {{ price(service.price_from) }}
                        </p>
                        <p v-if="price(service.price_to)" class="mt-1 text-sm text-white/50">{{ t('serviceDetailPage.upTo') }} {{ price(service.price_to) }}</p>
                    </div>
                    <div class="bg-ink-2 p-5">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{{ t('serviceDetailPage.duration') }}</p>
                        <p class="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-white md:text-xl">
                            <Icon name="clock" :size="18" class="text-signal" /> {{ service.duration || '—' }}
                        </p>
                    </div>
                </div>
                <p class="rise mt-3 max-w-xl text-xs text-white/55" style="--d: 200ms">{{ t('serviceDetailPage.priceNote') }}</p>

                <div class="rise mt-8 flex flex-col gap-3 sm:flex-row" style="--d: 240ms">
                    <Link :href="`/contact?service=${service.id}`" class="btn btn-signal">
                        {{ t('serviceDetailPage.bookThis') }} <Icon name="arrow-right" :size="18" class="btn-arrow" />
                    </Link>
                    <a v-if="phone" :href="telHref(phone)" class="btn btn-ghost"><Icon name="phone" :size="17" /> {{ phone }}</a>
                </div>
            </div>

            <div class="slide relative" style="--d: 60ms">
                <div class="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/[0.07] lg:aspect-[5/6]">
                    <img v-bind="imageFor(service.image, servicePhoto(service))" sizes="(min-width: 1024px) 45vw, 100vw"
                         :alt="name" fetchpriority="high" class="h-full w-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"></div>
                </div>
                <div class="led-signal absolute -bottom-px left-10 right-10"></div>
            </div>
        </div>
    </section>

    <!-- ═════════ Description ═════════ -->
    <section v-if="localized(service, 'description')" class="border-t border-white/[0.06] bg-ink-2 py-20 md:py-28">
        <div class="container-x grid gap-12 lg:grid-cols-12">
            <div v-reveal class="rich-text lg:col-span-7" v-html="localized(service, 'description')"></div>

            <aside class="lg:col-span-4 lg:col-start-9">
                <div v-reveal class="card sticky top-28 p-7">
                    <Icon name="calendar" :size="26" class="text-signal" />
                    <h2 class="mt-5 font-display text-xl font-semibold tracking-tight text-white">{{ c('servicesPage.ctaTitle') }}</h2>
                    <p class="mt-3 text-sm leading-relaxed text-white/60">{{ c('servicesPage.ctaText') }}</p>
                    <Link :href="`/contact?service=${service.id}`" class="btn btn-signal mt-6 w-full">{{ t('serviceDetailPage.bookThis') }}</Link>
                    <a v-if="phone" :href="telHref(phone)" class="btn btn-ghost mt-3 w-full"><Icon name="phone" :size="16" /> {{ phone }}</a>
                </div>
            </aside>
        </div>
    </section>

    <!-- ═════════ Work for this service ═════════ -->
    <section v-if="service.portfolio_items?.length" class="py-20 md:py-28">
        <div class="container-x">
            <div v-reveal class="flex items-end justify-between gap-6">
                <SectionHeading :label="c('portfolio.label')" :title="t('serviceDetailPage.gallery')" />
                <Link href="/portfolio" prefetch class="hidden items-center gap-2 text-sm font-semibold text-signal sm:inline-flex">
                    {{ c('portfolio.viewAll') }} <Icon name="arrow-right" :size="16" />
                </Link>
            </div>
            <div class="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                <Link v-for="(item, i) in service.portfolio_items.slice(0, 8)" :key="item.id" href="/portfolio" v-reveal:[(i%4)*80]="'scale'"
                      class="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3">
                    <img v-bind="imageFor(item.after_image || item.before_image, portfolioPhoto(item))" sizes="(min-width: 1024px) 25vw, 50vw"
                         :alt="localized(item, 'title')" loading="lazy" decoding="async"
                         class="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]" />
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"></div>
                    <p class="absolute inset-x-0 bottom-0 line-clamp-2 p-4 text-sm font-semibold text-white">{{ localized(item, 'title') }}</p>
                </Link>
            </div>
        </div>
    </section>

    <!-- ═════════ Other services ═════════ -->
    <section v-if="related.length" class="border-t border-white/[0.06] py-20 md:py-28">
        <div class="container-x">
            <div v-reveal class="flex items-end justify-between gap-6">
                <SectionHeading :label="c('services.label')" :title="t('serviceDetailPage.related')" />
                <Link href="/services" prefetch class="hidden items-center gap-2 text-sm font-semibold text-signal sm:inline-flex">
                    <Icon name="arrow-left" :size="16" /> {{ t('serviceDetailPage.backToServices') }}
                </Link>
            </div>
            <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="(item, i) in related" :key="item.id" v-reveal:[i*90]>
                    <ServiceCard :service="item" :index="i" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';
import Icon from '@/Components/Icon.vue';
import SectionHeading from '@/Components/SectionHeading.vue';
import ServiceCard from '@/Components/ServiceCard.vue';
import { telHref, useI18n } from '@/i18n.js';
import { imageFor, portfolioPhoto, servicePhoto } from '@/lib/img.js';

defineOptions({ layout: MainLayout });

const props = defineProps({
    service: { type: Object, required: true },
    related: { type: Array, default: () => [] },
});

const { t, c, localized, price } = useI18n();

const name = computed(() => localized(props.service, 'name'));
const phone = computed(() => c('footer.phone'));
</script>
