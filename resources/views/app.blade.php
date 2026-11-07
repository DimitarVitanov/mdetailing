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

    {{-- Self-hosted fonts (resources/css/fonts.css). Preloaded at low priority: they must not
         compete with the stylesheet and the hero photo for bandwidth, and text paints with the
         fallback font until they arrive (font-display: swap). Only the display face is preloaded;
         the body face is fetched when the CSS asks for it. --}}
    <link rel="preload" href="/fonts/unbounded-latin.woff2" as="font" type="font/woff2" crossorigin fetchpriority="low">
    @if (app()->getLocale() === 'mk')
    <link rel="preload" href="/fonts/unbounded-cyrillic.woff2" as="font" type="font/woff2" crossorigin fetchpriority="low">
    @endif
    {{-- The logo: the header and the intro both show it before any script has run. --}}
    <link rel="preload" as="image" href="/img/brand/logo-240.webp" fetchpriority="high">
    @if (! empty($preloadCar))
    {{-- The home page's car (HeroDrive.vue), fetched alongside the backdrop. --}}
    <link rel="preload" as="image" imagesrcset="/img/car/ferrari-f8-800.webp 800w, /img/car/ferrari-f8-1200.webp 1200w, /img/car/ferrari-f8-1600.webp 1600w" imagesizes="(min-width: 1024px) 58vw, 100vw" fetchpriority="high">
    @endif
    @if (! empty($preloadImage))
    {{-- The page's main photo, passed by its controller; widths match the <img> srcset. --}}
    <link rel="preload" as="image" imagesrcset="{{ collect($preloadImage['widths'])->map(fn ($w) => "{$preloadImage['base']}-{$w}.webp {$w}w")->implode(', ') }}" imagesizes="{{ $preloadImage['sizes'] }}" fetchpriority="high">
    @endif

    <style>html,body{background:#07080a;color:#fff}</style>
    {{-- Vite's tags for app.js and the page's own chunk (so it downloads alongside app.js). The
         stylesheet and modulepreloads stay here; the <script> tags are held in a <template> and
         added after the first paint, so the first screen (server-rendered, or the intro frame)
         is on screen before any script runs. The files are already preloaded, so nothing is
         downloaded later than before. --}}
    @php($vite = (string) app(\Illuminate\Foundation\Vite::class)(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"]))
    @php(preg_match_all('/<script\b[^>]*>.*?<\/script>/s', $vite, $scripts))
    {!! str_replace($scripts[0], '', $vite) !!}
    <template id="deferred-scripts">{!! implode('', $scripts[0]) !!}</template>
    <script>
        (function () {
            var done = false;
            function run() {
                if (done) return;
                done = true;
                var t = document.getElementById('deferred-scripts');
                if (!t) return;
                t.content.querySelectorAll('script').forEach(function (s) {
                    var n = document.createElement('script');
                    for (var i = 0; i < s.attributes.length; i++) n.setAttribute(s.attributes[i].name, s.attributes[i].value);
                    n.textContent = s.textContent;
                    document.head.appendChild(n);
                });
            }
            requestAnimationFrame(function () { requestAnimationFrame(run); });
            setTimeout(run, 1500); // background tabs never get an animation frame
        })();
    </script>
    @inertiaHead
</head>
<body class="antialiased">
    @unless (request()->is('admin', 'admin/*', 'login'))
    {{-- The intro's first frame, painted before any script runs (it is the first contentful paint).
         PageWipe.vue takes over from it; the inline script drops it at once for visitors who have
         already seen the intro this session. The animation is a safety net: should the scripts
         fail, the page is uncovered anyway. --}}
    <div id="intro-shell" style="position:fixed;inset:0;z-index:199;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;background:#07080a;animation:intro-shell-out .6s ease 4s forwards">
        <img src="/img/brand/logo-240.webp" alt="" width="240" height="180" style="width:min(80vw,22rem);height:auto;filter:drop-shadow(0 0 40px rgba(255,198,41,.35))">
        <span style="width:12rem;height:2px;background:linear-gradient(90deg,transparent,#bfe9ff 15%,#bfe9ff 85%,transparent);box-shadow:0 0 14px rgba(191,233,255,.6);animation:intro-line .7s cubic-bezier(.76,0,.24,1) .2s both"></span>
        <p style="margin:0;font:600 10px/1 'Unbounded',system-ui,sans-serif;letter-spacing:.4em;text-transform:uppercase;color:rgba(255,255,255,.8)">Premium · Car care</p>
    </div>
    <style>@keyframes intro-shell-out{to{opacity:0;visibility:hidden}}@keyframes intro-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}</style>
    <script>try{if(sessionStorage.getItem('md-intro')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.getElementById('intro-shell').remove()}catch(e){}</script>
    @endunless
    @inertia
</body>
</html>
