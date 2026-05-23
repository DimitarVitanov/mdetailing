<template>
    <AdminLayout title="Bookings">
        <Head title="Manage Bookings" />

        <!-- Status Filter -->
        <div class="flex flex-wrap gap-2 mb-6">
            <Link v-for="status in statuses" :key="status.value"
                  :href="'/admin/bookings' + (status.value !== 'all' ? '?status=' + status.value : '')"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  :class="currentStatus === status.value ? 'bg-gold text-dark' : 'bg-gray-800 text-gray-400 hover:text-white border border-white/5'">
                {{ status.label }}
            </Link>
        </div>

        <div class="bg-gray-800/50 border border-white/5 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-white/5">
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Client</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Vehicle</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Service</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Date</th>
                            <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                            <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in bookings" :key="booking.id" class="border-b border-white/5 hover:bg-white/[0.02]">
                            <td class="px-5 py-4">
                                <p class="text-sm font-medium text-white">{{ booking.client_name }}</p>
                                <p class="text-xs text-gray-400">{{ booking.client_email }}</p>
                                <p class="text-xs text-gray-400">{{ booking.client_phone }}</p>
                            </td>
                            <td class="px-5 py-4 text-sm text-gray-300">
                                {{ [booking.vehicle_year, booking.vehicle_make, booking.vehicle_model].filter(Boolean).join(' ') || '-' }}
                            </td>
                            <td class="px-5 py-4 text-sm text-gray-300">{{ booking.service?.name || 'N/A' }}</td>
                            <td class="px-5 py-4 text-sm text-gray-300">
                                {{ booking.preferred_date || 'Not set' }}
                                <span v-if="booking.preferred_time" class="text-gray-400 text-xs block">{{ booking.preferred_time }}</span>
                            </td>
                            <td class="px-5 py-4">
                                <select @change="updateStatus(booking, $event.target.value)" :value="booking.status"
                                        class="bg-gray-900 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:border-gold outline-none">
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td class="px-5 py-4 text-right space-x-2">
                                <Link :href="'/admin/bookings/' + booking.id" class="text-blue-400 hover:text-blue-300 text-sm">View</Link>
                                <button @click="deleteBooking(booking)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
                            </td>
                        </tr>
                        <tr v-if="!bookings.length">
                            <td colspan="6" class="px-5 py-8 text-center text-gray-400 text-sm">No bookings found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { Link, Head, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineProps({
    bookings: Array,
    currentStatus: String,
});

const statuses = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const updateStatus = (booking, status) => {
    router.post('/admin/bookings/' + booking.id + '/status', { status });
};

const deleteBooking = (booking) => {
    if (confirm('Delete this booking?')) {
        router.delete('/admin/bookings/' + booking.id);
    }
};
</script>
