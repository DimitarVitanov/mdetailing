<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $updates = [
            'exterior-detail' => ['name_mk' => 'Надворешно Деталирање', 'short_description_mk' => 'Комплетно надворешно миење, clay bar третман, полирање и восок за салонски сјај.', 'description_mk' => '<p>Нашиот пакет за Надворешно Деталирање обезбедува темелно чистење и заштита на вашето возило.</p>'],
            'interior-detail' => ['name_mk' => 'Внатрешно Деталирање', 'short_description_mk' => 'Длабинско чистење на секоја површина во возилото — седишта, теписи, табла и повеќе.', 'description_mk' => '<p>Нашето Внатрешно Деталирање го трансформира ентериерот на вашето возило.</p>'],
            'ceramic-coating' => ['name_mk' => 'Керамичка Заштита', 'short_description_mk' => 'Професионална керамичка заштита за долготрајна заштита на бојата и неверојатен сјај.', 'description_mk' => '<p>Врвна заштита на бојата со професионален керамички премаз.</p>'],
            'paint-correction' => ['name_mk' => 'Корекција на Боја', 'short_description_mk' => 'Повеќестепено машинско полирање за отстранување на гребнатини и swirl марки.', 'description_mk' => '<p>Враќање на бојата во подобра состојба од нова.</p>'],
            'paint-protection-film' => ['name_mk' => 'Заштитна Фолија (PPF)', 'short_description_mk' => 'Само-лечечка транспарентна фолија за заштита од камчиња и оштетувања.', 'description_mk' => '<p>PPF заштита за вашето возило од секојдневни опасности.</p>'],
            'full-detail-package' => ['name_mk' => 'Комплетен Пакет', 'short_description_mk' => 'Комплетен пакет — ентериер, екстериер, мотор и тркала, сè во едно.', 'description_mk' => '<p>Врвното искуство за деталирање — комплетна трансформација.</p>'],
        ];

        foreach ($updates as $slug => $data) {
            DB::table('services')->where('slug', $slug)->update($data);
        }

        // Portfolio items
        $portfolios = [
            'audi-a5-sportback-ceramic-coating' => ['title_mk' => 'Audi A5 Sportback Керамичка Заштита', 'description_mk' => 'Комплетна корекција на боја и 5-годишна керамичка заштита.'],
            'ferrari-f8-tributo-full-detail' => ['title_mk' => 'Ferrari F8 Tributo Комплетно Деталирање', 'description_mk' => 'Комплетно внатрешно и надворешно деталирање.'],
            'red-audi-s7-paint-correction' => ['title_mk' => 'Audi S7 Корекција на Боја', 'description_mk' => 'Повеќестепена корекција на боја за длабок сјај.'],
            'mercedes-gle-coupe-ceramic' => ['title_mk' => 'Mercedes GLE Coupe Керамичка Заштита', 'description_mk' => 'Професионална керамичка заштита.'],
            'audi-a5-exterior-detail' => ['title_mk' => 'Audi A5 Sportback Надворешно Деталирање', 'description_mk' => 'Комплетно надворешно миење и силант.'],
            'bmw-interior-restoration' => ['title_mk' => 'BMW Реставрација на Ентериер', 'description_mk' => 'Комплетна реставрација на кожа и длабинско чистење.'],
            'mercedes-gle-ppf' => ['title_mk' => 'Mercedes GLE Coupe Заштитна Фолија', 'description_mk' => 'Комплетна заштитна фолија на предниот дел.'],
            'ferrari-f8-ceramic' => ['title_mk' => 'Ferrari F8 Керамичка Заштита', 'description_mk' => 'Премиум керамичка заштита со неверојатна длабочина.'],
            'audi-a5-engine-bay' => ['title_mk' => 'Audi A5 Деталирање на Мотор', 'description_mk' => 'Чистење и дотерување на моторен простор.'],
        ];

        foreach ($portfolios as $slug => $data) {
            DB::table('portfolio_items')->where('slug', $slug)->update($data);
        }

        // Testimonials
        $testimonials = [
            'James Mitchell' => ['content_mk' => 'Апсолутно неверојатна работа! Мојот M5 изгледа подобро отколку кога го подигнав од салонот. Го препорачувам Limitless!'],
            'Sarah Williams' => ['content_mk' => 'Внатрешното деталирање беше феноменално. Секоја површина беше безгрешна, а кожата се чувствува како нова.'],
            'Michael Chen' => ['content_mk' => 'Им го доверив мојот GT3 и тие испорачаа над очекувањата. Вистински професионалци.'],
            'Alex Rodriguez' => ['content_mk' => 'Деталирањето на мојот AMG GT беше неверојатно. Бојата блеска како никогаш досега.'],
            'Emma Thompson' => ['content_mk' => 'Комплетниот пакет го вреди секој денар. Мојот Range Rover изгледа фабрички нов.'],
            'David Park' => ['content_mk' => 'PPF инсталацијата беше беспрекорна. Невидлива заштита и одлична работа.'],
        ];

        foreach ($testimonials as $name => $data) {
            DB::table('testimonials')->where('client_name', $name)->update($data);
        }
    }

    public function down(): void {}
};
