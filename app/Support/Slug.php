<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Slug
{
    /**
     * A slug for $value that no other row of $model uses (adds -2, -3, ...), so two items with
     * the same name no longer fail on the unique index.
     *
     * @param  class-string<Model>  $model
     */
    public static function unique(string $model, string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'item';
        $slug = $base;

        for ($i = 2; $model::where('slug', $slug)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists(); $i++) {
            $slug = "{$base}-{$i}";
        }

        return $slug;
    }
}
