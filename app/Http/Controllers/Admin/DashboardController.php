<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\Testimonial;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'services' => Service::count(),
                'portfolio' => PortfolioItem::count(),
                'testimonials' => Testimonial::count(),
                'bookings_pending' => Booking::where('status', 'pending')->count(),
                'bookings_total' => Booking::count(),
            ],
            'recentBookings' => Booking::with('service')->latest()->limit(5)->get(),
        ]);
    }
}
