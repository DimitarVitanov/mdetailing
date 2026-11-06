<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteContent extends Model
{
    protected $fillable = [
        'key',
        'page',
        'section',
        'type',
        'value_en',
        'value_mk',
        'sort_order',
    ];

    /**
     * Every text keyed by `key`, as ['en' => ..., 'mk' => ...]. Shared with every page and read by
     * App\Support\Seo; the admin forgets the cache whenever content is saved.
     *
     * @return array<string, array{en: ?string, mk: ?string}>
     */
    public static function cached(): array
    {
        return Cache::remember('site_content', 3600, fn () => static::orderBy('sort_order')
            ->get()
            ->keyBy('key')
            ->map(fn ($item) => [
                'en' => $item->value_en,
                'mk' => $item->value_mk,
            ])
            ->toArray());
    }

    public static function getByPage(string $page): array
    {
        return static::where('page', $page)
            ->orderBy('sort_order')
            ->get()
            ->keyBy('key')
            ->toArray();
    }

    public static function getAllGrouped(): array
    {
        return static::orderBy('page')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('page')
            ->toArray();
    }
}
