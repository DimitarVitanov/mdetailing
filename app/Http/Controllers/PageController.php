<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\Testimonial;
use App\Support\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    /** Columns the service cards use; the long HTML description is only sent to its own page. */
    private const SERVICE_CARD = ['id', 'name', 'name_mk', 'slug', 'short_description', 'short_description_mk', 'price_from', 'price_to', 'duration', 'image', 'is_featured', 'sort_order'];

    private const PORTFOLIO_CARD = ['id', 'title', 'title_mk', 'description', 'description_mk', 'before_image', 'after_image', 'category', 'service_id', 'sort_order'];

    private const TESTIMONIAL_CARD = ['id', 'client_name', 'client_vehicle', 'content', 'content_mk', 'rating'];

    public function home()
    {
        return Inertia::render('Home', [
            'services' => Service::active()->featured()->orderBy('sort_order')->limit(6)->get(self::SERVICE_CARD),
            'portfolio' => PortfolioItem::active()->featured()->orderBy('sort_order')->limit(6)->get(self::PORTFOLIO_CARD),
            'testimonials' => Testimonial::active()->featured()->latest()->limit(6)->get(self::TESTIMONIAL_CARD),
            'seo' => Seo::forPage('home'),
        ])->withViewData(['preloadPosters' => [
            // the first frames of the drive-in video (HeroDrive.vue, same ?v): one per stage shape
            ['href' => '/video/drive-tall-first.webp?v=3', 'media' => '(max-width: 1023px)'],
            ['href' => '/video/drive-wide-first.webp?v=3', 'media' => '(min-width: 1024px)'],
        ]]);
    }

    public function services()
    {
        return Inertia::render('Services', [
            'services' => Service::active()->orderBy('sort_order')->get(self::SERVICE_CARD),
            'seo' => Seo::forPage('services', [__('nav.services') => '/services']),
        ])->withViewData(['preloadImage' => self::photo('audi-black-front-2')]);
    }

    public function serviceShow(Service $service)
    {
        // A service switched off in the admin shouldn't stay reachable (or indexed) by its old link.
        abort_unless($service->is_active, 404);

        $service->load(['portfolioItems' => fn ($query) => $query->active()->orderBy('sort_order')->select(self::PORTFOLIO_CARD)]);
        $name = Seo::localized($service, 'name');
        $image = $service->image ? url("/media/1024/{$this->mediaPath($service->image)}") : null;

        return Inertia::render('ServiceDetail', [
            'service' => $service,
            'related' => Service::active()->whereKeyNot($service->id)->orderBy('sort_order')->limit(3)->get(self::SERVICE_CARD),
            'seo' => Seo::page(
                title: $name,
                description: Seo::localized($service, 'short_description'),
                image: $image,
                imageAlt: $name,
                breadcrumbs: [__('nav.services') => '/services', $name => "/services/{$service->slug}"],
                schema: [Seo::service($service, $image)],
            ),
        ]);
    }

    public function portfolio()
    {
        return Inertia::render('Portfolio', [
            'items' => PortfolioItem::active()->orderBy('sort_order')->get(self::PORTFOLIO_CARD),
            'categories' => PortfolioItem::active()->distinct()->pluck('category')->filter()->values(),
            'seo' => Seo::forPage('portfolio', [__('nav.portfolio') => '/portfolio']),
        ])->withViewData(['preloadImage' => self::photo('gallery-02')]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'testimonials' => Testimonial::active()->latest()->get(self::TESTIMONIAL_CARD),
            'seo' => Seo::forPage('about', [__('nav.about') => '/about']),
        ])->withViewData(['preloadImage' => self::photo('red-audi-04')]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'services' => Service::active()->orderBy('sort_order')->get(['id', 'name', 'name_mk', 'slug']),
            'seo' => Seo::forPage('contact', [__('nav.contact') => '/contact']),
        ])->withViewData(['preloadImage' => self::photo('gallery-06')]);
    }

    public function bookingStore(Request $request)
    {
        // Honeypot: a field people never see. Bots that fill it get the normal reply and no booking.
        if (filled($request->input('website'))) {
            return back()->with('success', __('booking.sent'));
        }

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

        return back()->with('success', __('booking.sent'));
    }

    /** A page's main site photo, for the <link rel="preload"> in the root template (widths as in lib/img.js). */
    private static function photo(string $name): array
    {
        return ['base' => "/img/opt/{$name}", 'widths' => [640, 1024, 1600], 'sizes' => '100vw'];
    }

    /** The /media URL path for an uploaded file (see MediaController). */
    private function mediaPath(string $path): string
    {
        return str_ends_with(strtolower($path), '.webp') ? $path : "{$path}.webp";
    }
}
