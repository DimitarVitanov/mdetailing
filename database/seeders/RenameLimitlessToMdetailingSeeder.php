<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RenameLimitlessToMdetailingSeeder extends Seeder
{
    public function run(): void
    {
        // Update site_contents table
        $textColumns = ['value_en', 'value_mk'];
        $siteContents = DB::table('site_contents')->get();

        foreach ($siteContents as $row) {
            $updates = [];
            foreach ($textColumns as $col) {
                if ($row->$col && (stripos($row->$col, 'Limitless') !== false || stripos($row->$col, 'limitless') !== false)) {
                    $val = $row->$col;
                    $val = str_replace('Limitless', 'MDetailing', $val);
                    $val = str_replace('limitless', 'mdetailing', $val);
                    $updates[$col] = $val;
                }
            }
            if (!empty($updates)) {
                DB::table('site_contents')->where('id', $row->id)->update($updates);
            }
        }

        // Update services table
        $serviceColumns = ['name', 'name_mk', 'short_description', 'short_description_mk', 'description', 'description_mk'];
        $services = DB::table('services')->get();

        foreach ($services as $row) {
            $updates = [];
            foreach ($serviceColumns as $col) {
                if ($row->$col && (stripos($row->$col, 'Limitless') !== false || stripos($row->$col, 'limitless') !== false)) {
                    $val = $row->$col;
                    $val = str_replace('Limitless', 'MDetailing', $val);
                    $val = str_replace('limitless', 'mdetailing', $val);
                    $updates[$col] = $val;
                }
            }
            if (!empty($updates)) {
                DB::table('services')->where('id', $row->id)->update($updates);
            }
        }

        // Update portfolio_items table
        $portfolioColumns = ['title', 'title_mk', 'description', 'description_mk'];
        $portfolioItems = DB::table('portfolio_items')->get();

        foreach ($portfolioItems as $row) {
            $updates = [];
            foreach ($portfolioColumns as $col) {
                if ($row->$col && (stripos($row->$col, 'Limitless') !== false || stripos($row->$col, 'limitless') !== false)) {
                    $val = $row->$col;
                    $val = str_replace('Limitless', 'MDetailing', $val);
                    $val = str_replace('limitless', 'mdetailing', $val);
                    $updates[$col] = $val;
                }
            }
            if (!empty($updates)) {
                DB::table('portfolio_items')->where('id', $row->id)->update($updates);
            }
        }

        // Update testimonials table
        $testimonialColumns = ['content', 'content_mk'];
        $testimonials = DB::table('testimonials')->get();

        foreach ($testimonials as $row) {
            $updates = [];
            foreach ($testimonialColumns as $col) {
                if ($row->$col && (stripos($row->$col, 'Limitless') !== false || stripos($row->$col, 'limitless') !== false)) {
                    $val = $row->$col;
                    $val = str_replace('Limitless', 'MDetailing', $val);
                    $val = str_replace('limitless', 'mdetailing', $val);
                    $updates[$col] = $val;
                }
            }
            if (!empty($updates)) {
                DB::table('testimonials')->where('id', $row->id)->update($updates);
            }
        }

        $this->command->info('Replaced all "Limitless" references with "MDetailing" across all content tables.');
    }
}
