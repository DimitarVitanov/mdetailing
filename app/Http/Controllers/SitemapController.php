<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $services = Service::active()->orderBy('sort_order')->get(['slug', 'updated_at']);
        // Both are 'Y-m-d H:i:s' strings (or null), so max() compares them correctly.
        $servicesUpdated = Service::active()->max('updated_at');
        $portfolioUpdated = PortfolioItem::active()->max('updated_at');

        // Public pages only. Service pages come from the database, so a new service is listed as
        // soon as it's active. lastmod is only given where it's actually known.
        $urls = collect([
            ['/', '1.0', 'weekly', max($servicesUpdated, $portfolioUpdated)],
            ['/services', '0.9', 'weekly', $servicesUpdated],
            ...$services->map(fn (Service $service) => ["/services/{$service->slug}", '0.8', 'monthly', $service->updated_at]),
            ['/portfolio', '0.8', 'weekly', $portfolioUpdated],
            ['/about', '0.6', 'monthly', null],
            ['/contact', '0.7', 'monthly', null],
        ])->map(fn ($page) => [
            'loc' => url($page[0]),
            'priority' => $page[1],
            'changefreq' => $page[2],
            'lastmod' => $page[3] ? Carbon::parse($page[3])->toW3cString() : null,
        ]);

        return response(view('sitemap', ['urls' => $urls])->render(), 200)
            ->header('Content-Type', 'application/xml');
    }

    public function robots(): Response
    {
        // Generated rather than a static file so the sitemap line carries the real domain (APP_URL).
        $lines = [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /login',
            '',
            'Sitemap: '.url('/sitemap.xml'),
        ];

        return response(implode("\n", $lines)."\n", 200)
            ->header('Content-Type', 'text/plain');
    }
}
