<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

/**
 * Editable texts added with the redesign: page titles/descriptions for Google, social links and
 * the "process" section on the home page.
 *
 * Safe on the live site: it only INSERTS keys that don't exist yet (firstOrCreate) and never
 * changes a row that is already there, so content edited in the admin stays as it is.
 * Running it twice does nothing the second time.
 *
 *   php artisan db:seed --class=RedesignContentSeeder --force
 *
 * Don't run SiteContentSeeder on the live site: it uses updateOrCreate and would overwrite
 * edited texts with its defaults.
 */
class RedesignContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Search engines and link previews (App\Support\Seo falls back to the same texts).
            ['seo.home.title', 'seo', 'home', 'text', 'MDetailing — Premium Car Detailing in Strumica', 'MDetailing — Премиум авто деталинг во Струмица'],
            ['seo.home.description', 'seo', 'home', 'textarea', 'Professional car detailing in Strumica: deep interior and exterior cleaning, 3-stage paint polishing, ceramic coating and headlight restoration. Book your detail today.', 'Професионален авто деталинг во Струмица: детално внатрешно и надворешно чистење, полирање во 3 фази, керамичка заштита и полирање на фарови. Закажете термин.'],
            ['seo.services.title', 'seo', 'services', 'text', 'Services & Prices', 'Услуги и цени'],
            ['seo.services.description', 'seo', 'services', 'textarea', 'Every MDetailing service with prices: interior and exterior detailing, paint correction, ceramic coating and more.', 'Сите деталинг услуги на MDetailing со цени: внатрешно и надворешно чистење, корекција на боја, керамичка заштита и повеќе.'],
            ['seo.portfolio.title', 'seo', 'portfolio', 'text', 'Portfolio', 'Портфолио'],
            ['seo.portfolio.description', 'seo', 'portfolio', 'textarea', 'See the cars we have detailed in our Strumica studio — before and after.', 'Погледнете ги возилата што ги деталиравме во нашето студио во Струмица — пред и потоа.'],
            ['seo.about.title', 'seo', 'about', 'text', 'About Us', 'За нас'],
            ['seo.about.description', 'seo', 'about', 'textarea', 'Meet MDetailing — a premium car detailing studio in Strumica and the people behind every detail.', 'Запознајте го MDetailing — студио за премиум авто деталинг во Струмица и луѓето зад секој детал.'],
            ['seo.contact.title', 'seo', 'contact', 'text', 'Contact & Booking', 'Контакт и закажување'],
            ['seo.contact.description', 'seo', 'contact', 'textarea', 'Book a detailing appointment at MDetailing, Strumica. Phone, address and opening hours.', 'Закажете термин за деталинг во MDetailing, Струмица. Телефон, адреса и работно време.'],

            // Social profiles: an icon only shows in the footer once its link is filled in.
            ['social.instagram', 'global', 'social', 'text', '', ''],
            ['social.facebook', 'global', 'social', 'text', '', ''],
            ['social.tiktok', 'global', 'social', 'text', '', ''],

            // What the map on the contact page searches for.
            ['contact.mapQuery', 'contact', 'map', 'text', 'MDetailing.mk, Strumica', 'MDetailing.mk, Струмица'],

            // Home page: "process" section.
            ['process.label', 'home', 'process', 'text', 'Our Process', 'Процес'],
            ['process.title', 'home', 'process', 'text', 'Four steps to', 'Четири чекори до'],
            ['process.titleAccent', 'home', 'process', 'text', 'a flawless finish', 'совршен сјај'],
            ['process.step1.title', 'home', 'process', 'text', 'Inspection', 'Преглед'],
            ['process.step1.description', 'home', 'process', 'textarea', 'We inspect the paint, interior and every surface under studio light and agree on the plan with you.', 'Ја прегледуваме бојата, ентериерот и секоја површина под студиско светло и заедно го договараме планот.'],
            ['process.step2.title', 'home', 'process', 'text', 'Deep Clean', 'Длабинско чистење'],
            ['process.step2.description', 'home', 'process', 'textarea', 'Hand wash, decontamination and a deep clean of the interior, wheels and every hidden corner.', 'Рачно миење, деконтаминација и длабинско чистење на ентериерот, тркалата и секое скриено место.'],
            ['process.step3.title', 'home', 'process', 'text', 'Correction', 'Корекција'],
            ['process.step3.description', 'home', 'process', 'textarea', 'Machine polishing removes swirls and light scratches and brings back depth and gloss.', 'Машинското полирање ги отстранува swirl трагите и ситните гребнатини и ги враќа длабочината и сјајот.'],
            ['process.step4.title', 'home', 'process', 'text', 'Protection', 'Заштита'],
            ['process.step4.description', 'home', 'process', 'textarea', 'Ceramic coating or sealant locks in the result and makes every wash easier.', 'Керамичката заштита или силантот го чуваат резултатот и го олеснуваат секое следно миење.'],
        ];

        $added = 0;

        foreach ($contents as $i => [$key, $page, $section, $type, $en, $mk]) {
            $row = SiteContent::firstOrCreate(['key' => $key], [
                'page' => $page,
                'section' => $section,
                'type' => $type,
                'value_en' => $en,
                'value_mk' => $mk,
                'sort_order' => 200 + $i,
            ]);

            $added += $row->wasRecentlyCreated ? 1 : 0;
        }

        Cache::forget('site_content');

        $this->command?->info("Added {$added} new content keys; existing content was left unchanged.");
    }
}
