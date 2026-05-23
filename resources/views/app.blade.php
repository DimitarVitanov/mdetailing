<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'MDetailing Premium Car Care') }}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900|playfair-display:400,500,600,700,800,900" rel="stylesheet" media="print" onload="this.media='all'" />
        <link rel="preload" href="/img/webp/hero-studio.webp" as="image" type="image/webp">
        @vite(['resources/js/app.js', 'resources/css/app.css'])
        @inertiaHead
        <style>body{background:#0a0a0a;}</style>
    </head>
    <body class="antialiased" style="background:#0a0a0a;">
        @inertia
    </body>
</html>
