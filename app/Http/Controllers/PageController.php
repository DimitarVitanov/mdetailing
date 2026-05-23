<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
            'services' => Service::active()->featured()->orderBy('sort_order')->limit(6)->get(),
            'portfolio' => PortfolioItem::active()->featured()->orderBy('sort_order')->limit(6)->get(),
            'testimonials' => Testimonial::active()->featured()->latest()->limit(6)->get(),
        ]);
    }

    public function services()
    {
        return Inertia::render('Services', [
            'services' => Service::active()->orderBy('sort_order')->get(),
        ]);
    }

    public function serviceShow(Service $service)
    {
        return Inertia::render('ServiceDetail', [
            'service' => $service->load('portfolioItems'),
        ]);
    }

    public function portfolio()
    {
        return Inertia::render('Portfolio', [
            'items' => PortfolioItem::active()->with('service')->orderBy('sort_order')->get(),
            'categories' => PortfolioItem::active()->distinct()->pluck('category')->filter()->values(),
        ]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'testimonials' => Testimonial::active()->latest()->get(),
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'services' => Service::active()->orderBy('sort_order')->get(),
        ]);
    }

    public function bookingStore(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_phone' => 'required|string|max:50',
            'vehicle_make' => 'nullable|string|max:255',
            'vehicle_model' => 'nullable|string|max:255',
            'vehicle_year' => 'nullable|string|max:10',
            'service_id' => 'nullable|exists:services,id',
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string|max:50',
            'message' => 'nullable|string|max:2000',
        ]);

        Booking::create($validated);

        return back()->with('success', 'Your booking request has been submitted! We will contact you shortly.');
    }
}
