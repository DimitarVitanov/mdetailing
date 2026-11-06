<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The site language comes from the `locale` cookie the language switcher sets (Macedonian by
 * default), so the server can print <html lang>, titles and descriptions in that language.
 */
class SetLocale
{
    public const LOCALES = ['mk', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('locale');

        app()->setLocale(in_array($locale, self::LOCALES, true) ? $locale : 'mk');

        return $next($request);
    }
}
