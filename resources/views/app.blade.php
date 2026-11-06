<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#07080a">
    <meta name="format-detection" content="telephone=no">

    {{-- Title, meta, social cards and JSON-LD from App\Support\Seo, in the first response for crawlers
         and link previews. The data-inertia keys match MainLayout's <Head>, which takes these tags
         over on client-side visits. With SSR running, @inertiaHead prints them instead. --}}
    @php($ssr = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch())
    @unless ($ssr)
        @php($seo = $page['props']['seo'] ?? \App\Support\Seo::page())
        <title data-inertia="">{{ $seo['title'] }}</title>
        @foreach ($seo['tags'] as $tag)
        <{{ $tag['tag'] }} {!! collect($tag['attrs'])->map(fn ($value, $name) => $name.'="'.e($value).'"')->implode(' ') !!} data-inertia="{{ $tag['key'] }}">
        @endforeach
        @if ($seo['schema'])
        <script type="application/ld+json" data-inertia="schema">{!! $seo['schema'] !!}</script>
        @endif
    @endunless

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    {{-- Self-hosted fonts (resources/css/fonts.css): fetch the ones this language needs before the CSS asks. --}}
    <link rel="preload" href="/fonts/unbounded-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/onest-latin.woff2" as="font" type="font/woff2" crossorigin>
    @if (app()->getLocale() === 'mk')
    <link rel="preload" href="/fonts/unbounded-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/onest-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
    @endif
    @if (! empty($preloadImage))
    {{-- The page's main photo, passed by its controller; widths match the <img> srcset. --}}
    <link rel="preload" as="image" imagesrcset="{{ collect($preloadImage['widths'])->map(fn ($w) => "{$preloadImage['base']}-{$w}.webp {$w}w")->implode(', ') }}" imagesizes="{{ $preloadImage['sizes'] }}" fetchpriority="high">
    @endif

    <style>html,body{background:#07080a;color:#fff}</style>
    {{-- The page's own chunk too, so it downloads alongside app.js instead of after it. --}}
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
