<?php

namespace App\Support;

use App\Models\Service;
use App\Models\SiteContent;

/**
 * Everything search engines and link previews read from <head>: title, description, robots,
 * canonical, Open Graph / Twitter cards and JSON-LD.
 *
 * It is built on the server so the first HTML response already carries it (crawlers and
 * social link previews don't run JavaScript), and shared as the `seo` prop so MainLayout's
 * <Head> keeps it current on client-side visits. Both use the same `data-inertia` keys, so
 * Inertia swaps the server tags in place instead of duplicating them.
 *
 * Titles and descriptions can be edited in the admin (Content → seo.*); the texts below are
 * the fallbacks when a key is missing or empty.
 */
class Seo
{
    public const BRAND = 'MDetailing';

    public const DEFAULT_IMAGE = '/img/brand/og-cover.jpg';

    public const LOGO = '/img/brand/logo-512.png';

    /** Where the studio is, for the LocalBusiness schema (the address text itself is editable content). */
    public const LOCALITY = 'Strumica';

    public const COUNTRY = 'MK';

    private const DEFAULTS = [
        'home' => [
            'mk' => ['MDetailing — Премиум авто деталинг во Струмица', 'Професионален авто деталинг во Струмица: детално внатрешно и надворешно чистење, полирање во 3 фази, керамичка заштита и полирање на фарови. Закажете термин.'],
            'en' => ['MDetailing — Premium Car Detailing in Strumica', 'Professional car detailing in Strumica: deep interior and exterior cleaning, 3-stage paint polishing, ceramic coating and headlight restoration. Book your detail today.'],
        ],
        'services' => [
            'mk' => ['Услуги и цени', 'Сите деталинг услуги на MDetailing со цени: внатрешно и надворешно чистење, корекција на боја, керамичка заштита и повеќе.'],
            'en' => ['Services & Prices', 'Every MDetailing service with prices: interior and exterior detailing, paint correction, ceramic coating and more.'],
        ],
        'portfolio' => [
            'mk' => ['Портфолио', 'Погледнете ги возилата што ги деталиравме во нашето студио во Струмица — пред и потоа.'],
            'en' => ['Portfolio', 'See the cars we have detailed in our Strumica studio — before and after.'],
        ],
        'about' => [
            'mk' => ['За нас', 'Запознајте го MDetailing — студио за премиум авто деталинг во Струмица и луѓето зад секој детал.'],
            'en' => ['About Us', 'Meet MDetailing — a premium car detailing studio in Strumica and the people behind every detail.'],
        ],
        'contact' => [
            'mk' => ['Контакт и закажување', 'Закажете термин за деталинг во MDetailing, Струмица. Телефон, адреса и работно време.'],
            'en' => ['Contact & Booking', 'Book a detailing appointment at MDetailing, Strumica. Phone, address and opening hours.'],
        ],
    ];

    /**
     * Head data for one of the main pages (a key of DEFAULTS).
     *
     * @param  array<string, string>  $breadcrumbs  label => path, for the trail after "Home"
     * @param  array<int, array<string, mixed>>  $schema  extra JSON-LD nodes
     */
    public static function forPage(string $page, array $breadcrumbs = [], array $schema = []): array
    {
        $locale = self::locale();
        [$title, $description] = self::DEFAULTS[$page][$locale] ?? self::DEFAULTS['home'][$locale];

        return self::page(
            title: self::content("seo.{$page}.title") ?: $title,
            description: self::content("seo.{$page}.description") ?: $description,
            breadcrumbs: $breadcrumbs,
            schema: $schema,
        );
    }

    /**
     * @param  array<string, string>  $breadcrumbs  label => path, for the trail after "Home"
     * @param  array<int, array<string, mixed>>  $schema  extra JSON-LD nodes for this page
     * @return array{title: string, tags: list<array{tag: string, key: string, attrs: array<string, string>}>, schema: ?string}
     */
    public static function page(
        ?string $title = null,
        ?string $description = null,
        ?string $image = null,
        ?string $imageAlt = null,
        string $type = 'website',
        bool $index = true,
        array $breadcrumbs = [],
        array $schema = [],
    ): array {
        $locale = self::locale();
        [$defaultTitle, $defaultDescription] = self::DEFAULTS['home'][$locale];

        $title = match (true) {
            blank($title) => $defaultTitle,
            str_contains($title, self::BRAND) => $title,
            default => "{$title} | ".self::BRAND,
        };
        $description = $description ?: $defaultDescription;
        $url = url()->current();
        $imageUrl = url($image ?: self::DEFAULT_IMAGE);

        $tags = [
            ['meta', 'description', ['name' => 'description', 'content' => $description]],
            ['meta', 'robots', ['name' => 'robots', 'content' => $index ? 'index, follow, max-image-preview:large' : 'noindex, nofollow']],
            ['link', 'canonical', ['rel' => 'canonical', 'href' => $url]],
            ['meta', 'og:site_name', ['property' => 'og:site_name', 'content' => self::BRAND]],
            ['meta', 'og:locale', ['property' => 'og:locale', 'content' => $locale === 'mk' ? 'mk_MK' : 'en_US']],
            ['meta', 'og:type', ['property' => 'og:type', 'content' => $type]],
            ['meta', 'og:title', ['property' => 'og:title', 'content' => $title]],
            ['meta', 'og:description', ['property' => 'og:description', 'content' => $description]],
            ['meta', 'og:url', ['property' => 'og:url', 'content' => $url]],
            ['meta', 'og:image', ['property' => 'og:image', 'content' => $imageUrl]],
            ['meta', 'og:image:alt', ['property' => 'og:image:alt', 'content' => $imageAlt ?: self::BRAND]],
            ['meta', 'twitter:card', ['name' => 'twitter:card', 'content' => 'summary_large_image']],
            ['meta', 'twitter:title', ['name' => 'twitter:title', 'content' => $title]],
            ['meta', 'twitter:description', ['name' => 'twitter:description', 'content' => $description]],
            ['meta', 'twitter:image', ['name' => 'twitter:image', 'content' => $imageUrl]],
        ];

        // The default cover's size is known, which lets previews render before the image loads.
        if (! $image) {
            $tags[] = ['meta', 'og:image:width', ['property' => 'og:image:width', 'content' => '1200']];
            $tags[] = ['meta', 'og:image:height', ['property' => 'og:image:height', 'content' => '630']];
        }

        return [
            'title' => $title,
            'tags' => array_map(fn ($tag) => ['tag' => $tag[0], 'key' => $tag[1], 'attrs' => $tag[2]], $tags),
            // Private pages (admin, login) get no structured data.
            'schema' => $index ? self::graph([
                self::business(),
                self::website(),
                ...($breadcrumbs ? [self::breadcrumbs($breadcrumbs)] : []),
                ...$schema,
            ]) : null,
        ];
    }

    /** A service as a schema.org Service with its price range, for its own page. */
    public static function service(Service $service, ?string $image = null): array
    {
        $offer = array_filter([
            '@type' => 'Offer',
            'url' => url("/services/{$service->slug}"),
            'priceCurrency' => 'EUR',
            'price' => $service->price_to ? null : self::amount($service->price_from),
            'priceSpecification' => $service->price_to ? [
                '@type' => 'PriceSpecification',
                'minPrice' => self::amount($service->price_from),
                'maxPrice' => self::amount($service->price_to),
                'priceCurrency' => 'EUR',
            ] : null,
        ]);

        return array_filter([
            '@type' => 'Service',
            'name' => self::localized($service, 'name'),
            'description' => self::localized($service, 'short_description'),
            'serviceType' => $service->name,
            'image' => $image,
            'provider' => ['@id' => self::id('business')],
            'areaServed' => self::LOCALITY,
            'offers' => $offer,
        ]);
    }

    /** The current locale's value of a model field, falling back to English (as i18n.js does). */
    public static function localized(object $model, string $field): string
    {
        $mk = $model->{"{$field}_mk"} ?? null;

        return (string) (self::locale() === 'mk' && filled($mk) ? $mk : $model->{$field});
    }

    /** @return array<string, mixed> */
    private static function business(): array
    {
        $phone = self::content('footer.phone');
        $email = self::content('footer.email');
        $priceRange = Service::active()->selectRaw('MIN(price_from) as min_price, MAX(COALESCE(price_to, price_from)) as max_price')->first();

        return array_filter([
            '@type' => 'AutoWash',
            '@id' => self::id('business'),
            'name' => self::BRAND,
            'alternateName' => 'MDetailing Premium Car Care',
            'description' => self::DEFAULTS['home'][self::locale()][1],
            'url' => self::home(),
            'logo' => url(self::LOGO),
            'image' => url(self::DEFAULT_IMAGE),
            'telephone' => $phone ?: null,
            'email' => $email ?: null,
            'priceRange' => $priceRange?->min_price ? '€'.self::amount($priceRange->min_price).' – €'.self::amount($priceRange->max_price) : null,
            'currenciesAccepted' => 'EUR, MKD',
            'address' => array_filter([
                '@type' => 'PostalAddress',
                'streetAddress' => self::content('footer.address', 'en') ?: null,
                'addressLocality' => self::LOCALITY,
                'addressCountry' => self::COUNTRY,
            ]),
            'areaServed' => self::LOCALITY,
            'sameAs' => array_values(array_filter([
                self::content('social.instagram'),
                self::content('social.facebook'),
                self::content('social.tiktok'),
            ])) ?: null,
        ]);
    }

    /** @return array<string, mixed> */
    private static function website(): array
    {
        return [
            '@type' => 'WebSite',
            '@id' => self::id('website'),
            'url' => self::home(),
            'name' => self::BRAND,
            'inLanguage' => ['mk', 'en'],
            'publisher' => ['@id' => self::id('business')],
        ];
    }

    /**
     * @param  array<string, string>  $trail  label => path
     * @return array<string, mixed>
     */
    private static function breadcrumbs(array $trail): array
    {
        $home = self::locale() === 'mk' ? 'Почетна' : 'Home';
        $items = [];
        foreach ([$home => '/'] + $trail as $label => $path) {
            $items[] = [
                '@type' => 'ListItem',
                'position' => count($items) + 1,
                'name' => $label,
                'item' => url($path),
            ];
        }

        return ['@type' => 'BreadcrumbList', 'itemListElement' => $items];
    }

    /** @param  array<int, array<string, mixed>>  $nodes */
    private static function graph(array $nodes): string
    {
        // JSON_HEX_TAG keeps a stray "</script>" in any text from closing the tag early.
        return json_encode(
            ['@context' => 'https://schema.org', '@graph' => $nodes],
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP,
        );
    }

    /** An editable site text in the current (or given) locale, falling back to English. */
    private static function content(string $key, ?string $locale = null): ?string
    {
        $item = SiteContent::cached()[$key] ?? null;
        if (! $item) {
            return null;
        }

        $value = $item[$locale ?? self::locale()] ?? null;

        return filled($value) ? trim($value) : (filled($item['en'] ?? null) ? trim($item['en']) : null);
    }

    private static function amount(mixed $value): string
    {
        $formatted = number_format((float) $value, 2, '.', '');

        return str_ends_with($formatted, '.00') ? substr($formatted, 0, -3) : $formatted;
    }

    private static function locale(): string
    {
        return app()->getLocale() === 'en' ? 'en' : 'mk';
    }

    private static function home(): string
    {
        return rtrim(url('/'), '/').'/';
    }

    /** A node's @id, e.g. id('business'), to reference it from page-specific schema. */
    public static function id(string $name): string
    {
        return self::home()."#{$name}";
    }
}
