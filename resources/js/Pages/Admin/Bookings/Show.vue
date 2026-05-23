<template>
    <AdminLayout title="Booking Details">
        <Head title="Booking Details" />

        <Link href="/admin/bookings" class="inline-flex items-center space-x-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            <span>Back to Bookings</span>
        </Link>

        <div class="max-w-3xl bg-gray-800/50 border border-white/5 rounded-xl overflow-hidden">
            <div class="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 class="text-lg font-semibold">Booking #{{ booking.id }}</h2>
                <span class="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                      :class="statusClasses[booking.status]">
                    {{ booking.status }}
                </span>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-gold text-sm font-semibold uppercase tracking-wider mb-4">Client Information</h3>
                    <dl class="space-y-3">
                        <div><dt class="text-gray-400 text-xs">Name</dt><dd class="text-white text-sm">{{ booking.client_name }}</dd></div>
                        <div><dt class="text-gray-400 text-xs">Email</dt><dd class="text-white text-sm">{{ booking.client_email }}</dd></div>
                        <div><dt class="text-gray-400 text-xs">Phone</dt><dd class="text-white text-sm">{{ booking.client_phone }}</dd></div>
                    </dl>
                </div>
                <div>
                    <h3 class="text-gold text-sm font-semibold uppercase tracking-wider mb-4">Booking Details</h3>
                    <dl class="space-y-3">
                        <div><dt class="text-gray-400 text-xs">Service</dt><dd class="text-white text-sm">{{ booking.service?.name || 'N/A' }}</dd></div>
                        <div><dt class="text-gray-400 text-xs">Vehicle</dt><dd class="text-white text-sm">{{ [booking.vehicle_year, booking.vehicle_make, booking.vehicle_model].filter(Boolean).join(' ') || 'Not specified' }}</dd></div>
                        <div><dt class="text-gray-400 text-xs">Preferred Date</dt><dd class="text-white text-sm">{{ booking.preferred_date || 'Not set' }}</dd></div>
                        <div><dt class="text-gray-400 text-xs">Preferred Time</dt><dd class="text-white text-sm">{{ booking.preferred_time || 'Not set' }}</dd></div>
                    </dl>
                </div>
                <div v-if="booking.message" class="md:col-span-2">
                    <h3 class="text-gold text-sm font-semibold uppercase tracking-wider mb-2">Message</h3>
                    <p class="text-gray-300 text-sm leading-relaxed bg-gray-900/50 rounded-lg p-4">{{ booking.message }}</p>
                </div>
            </div>

            <div class="p-6 border-t border-white/5 flex items-center space-x-3">
                <select @change="updateStatus($event.target.value)" :value="booking.status"
                        class="bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-gold outline-none">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button @click="deleteBooking" class="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition-colors">
                    Delete Booking
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps({ booking: Object });

const statusClasses = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    confirmed: 'bg-blue-500/10 text-blue-400',
    completed: 'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400',
};

const updateStatus = (status) => {
    router.patch('/admin/bookings/' + props.booking.id + '/status', { status });
};

const deleteBooking = () => {
    if (confirm('Delete this booking?')) {
        router.delete('/admin/bookings/' + props.booking.id);
    }
};
</script>
