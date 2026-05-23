<template>
    <div class="min-h-screen bg-gray-900 flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-950 border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-30"
               :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
               style="transition: transform 0.3s ease;">
            <!-- Logo -->
            <div class="h-16 flex items-center px-6 border-b border-white/5">
                <Link href="/admin" class="flex items-center space-x-3">
                    <img src="/img/webp/mdetailing-logo.webp" alt="MDetailing" class="h-10 w-auto" />
                    <span class="text-white font-bold tracking-tight">Admin</span>
                </Link>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <SidebarLink href="/admin" icon="dashboard" :active="$page.url === '/admin'">Dashboard</SidebarLink>
                <SidebarLink href="/admin/services" icon="services" :active="$page.url.startsWith('/admin/services')">Services</SidebarLink>
                <SidebarLink href="/admin/portfolio" icon="portfolio" :active="$page.url.startsWith('/admin/portfolio')">Portfolio</SidebarLink>
                <SidebarLink href="/admin/testimonials" icon="testimonials" :active="$page.url.startsWith('/admin/testimonials')">Testimonials</SidebarLink>
                <SidebarLink href="/admin/bookings" icon="bookings" :active="$page.url.startsWith('/admin/bookings')">Bookings</SidebarLink>
                <SidebarLink href="/admin/content" icon="content" :active="$page.url.startsWith('/admin/content')">Content</SidebarLink>

                <div class="pt-4 mt-4 border-t border-white/5">
                    <SidebarLink href="/admin/change-password" icon="password" :active="$page.url.startsWith('/admin/change-password')">Change Password</SidebarLink>
                    <SidebarLink href="/" icon="website" :active="false">View Website</SidebarLink>
                </div>
            </nav>

            <!-- User -->
            <div class="p-4 border-t border-white/5">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gold/20 text-gold rounded-full flex items-center justify-center text-sm font-semibold">
                        {{ $page.props.auth.user?.name?.charAt(0) || 'A' }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">{{ $page.props.auth.user?.name }}</p>
                        <p class="text-xs text-gray-400 truncate">{{ $page.props.auth.user?.email }}</p>
                    </div>
                    <Link href="/logout" method="post" as="button" class="text-gray-400 hover:text-red-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    </Link>
                </div>
            </div>
        </aside>

        <!-- Overlay for mobile -->
        <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>

        <!-- Main Content -->
        <div class="flex-1 lg:ml-64">
            <!-- Top Bar -->
            <header class="h-16 bg-gray-950/50 backdrop-blur border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
                <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden text-gray-400 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <h1 class="text-lg font-semibold text-white">{{ title }}</h1>
                <div></div>
            </header>

            <!-- Flash Messages -->
            <transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in">
                <div v-if="$page.props.flash?.success" class="mx-6 mt-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                    {{ $page.props.flash.success }}
                </div>
            </transition>

            <!-- Page Content -->
            <main class="p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

defineProps({
    title: { type: String, default: 'Dashboard' },
});

const sidebarOpen = ref(false);

const icons = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    services: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    portfolio: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    testimonials: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    bookings: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    content: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    password: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    website: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
};

const SidebarLink = {
    props: ['href', 'icon', 'active'],
    components: { Link },
    render() {
        const iconPath = icons[this.icon] || icons.dashboard;
        return h(
            Link,
            {
                href: this.href,
                class: [
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    this.active ? 'bg-gold/10 text-gold' : 'text-gray-400 hover:text-white hover:bg-white/5',
                ],
            },
            () => [
                h('svg', { class: 'w-5 h-5 flex-shrink-0', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/>` }),
                h('span', {}, this.$slots.default?.()),
            ]
        );
    },
};
</script>
