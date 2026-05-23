<template>
    <AdminLayout title="Dashboard">
        <Head title="Admin Dashboard" />

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div v-for="(stat, index) in statCards" :key="index"
                 class="bg-gray-800/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-colors">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-400 text-sm">{{ stat.label }}</span>
                    <div class="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/>
                        </svg>
                    </div>
                </div>
                <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
            </div>
        </div>

        <!-- Recent Bookings -->
        <div class="bg-gray-800/50 border border-white/5 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-white/5 flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Bookings</h2>
                <Link href="/admin/bookings" class="text-gold text-sm hover:text-gold-light transition-colors">View All &rarr;</Link>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/5">
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Client</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Service</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Date</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in recentBookings" :key="booking.id" class="border-b border-white/5 hover:bg-white/[0.02]">
                            <td class="px-5 py-3">
                                <p class="text-sm font-medium text-white">{{ booking.client_name }}</p>
                                <p class="text-xs text-gray-400">{{ booking.client_email }}</p>
                            </td>
                            <td class="px-5 py-3 text-sm text-gray-300">{{ booking.service?.name || 'N/A' }}</td>
                            <td class="px-5 py-3 text-sm text-gray-300">{{ booking.preferred_date || 'Not set' }}</td>
                            <td class="px-5 py-3">
                                <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                                      :class="statusClasses[booking.status]">
                                    {{ booking.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="!recentBookings.length">
                            <td colspan="4" class="px-5 py-8 text-center text-gray-400 text-sm">No bookings yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({
    stats: Object,
    recentBookings: Array,
});

const statusClasses = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    confirmed: 'bg-blue-500/10 text-blue-400',
    completed: 'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400',
};

const statCards = [
    { label: 'Services', value: props.stats.services, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Portfolio Items', value: props.stats.portfolio, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Testimonials', value: props.stats.testimonials, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { label: 'Pending Bookings', value: props.stats.bookings_pending, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Bookings', value: props.stats.bookings_total, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];
</script>
