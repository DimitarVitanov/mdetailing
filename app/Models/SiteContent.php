<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
