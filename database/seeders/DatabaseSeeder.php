<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\SiteContent;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@limitless.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Services
        $services = [
            [
                'name' => 'Exterior Detail',
                'name_mk' => 'Надворешно Деталирање',
                'slug' => 'exterior-detail',
                'short_description' => 'Complete exterior wash, clay bar treatment, polish, and wax for a showroom shine.',
                'short_description_mk' => 'Комплетно надворешно миење, clay bar третман, полирање и восок за салонски сјај.',
                'description' => '<p>Our Exterior Detail package gives your vehicle a thorough cleaning and protection treatment. The process includes:</p><ul><li>Hand wash and dry</li><li>Clay bar decontamination</li><li>Machine polish to remove light scratches and swirl marks</li><li>Premium wax or sealant application</li><li>Tire and trim dressing</li><li>Window cleaning inside and out</li></ul><p>Perfect for vehicles that need a refresh and basic paint protection.</p>',
                'description_mk' => '<p>Нашиот пакет за Надворешно Деталирање обезбедува темелно чистење и заштита. Процесот вклучува:</p><ul><li>Рачно миење и сушење</li><li>Clay bar деконтаминација</li><li>Машинско полирање за отстранување на ситни гребнатини</li><li>Апликација на премиум восок или силант</li><li>Дотерување на гуми и пластика</li><li>Чистење на стакла од внатре и надвор</li></ul><p>Перфектно за возила кои имаат потреба од освежување и основна заштита.</p>',
                'price_from' => 149.99,
                'price_to' => 249.99,
                'duration' => '3-4 hours',
                'sort_order' => 1,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Interior Detail',
                'name_mk' => 'Внатрешно Деталирање',
                'slug' => 'interior-detail',
                'short_description' => 'Deep clean every surface inside your car — seats, carpets, dash, and more.',
                'short_description_mk' => 'Длабинско чистење на секоја површина во возилото — седишта, теписи, табла и повеќе.',
                'description' => '<p>Our Interior Detail transforms the inside of your vehicle. Services include:</p><ul><li>Full vacuum including seats, carpets, and trunk</li><li>Steam cleaning of all surfaces</li><li>Leather cleaning and conditioning (or fabric shampooing)</li><li>Dashboard and console detailing</li><li>Door panel and trim cleaning</li><li>Window cleaning</li><li>Air freshener application</li></ul>',
                'description_mk' => '<p>Нашето Внатрешно Деталирање го трансформира ентериерот на вашето возило. Услугите вклучуваат:</p><ul><li>Комплетно вакуумирање на седишта, теписи и багажник</li><li>Парно чистење на сите површини</li><li>Чистење и кондиционирање на кожа (или шампонирање на ткаенина)</li><li>Деталирање на табла и конзола</li><li>Чистење на врати и пластики</li><li>Чистење на стакла</li><li>Апликација на освежувач</li></ul>',
                'price_from' => 129.99,
                'price_to' => 199.99,
                'duration' => '2-3 hours',
                'sort_order' => 2,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Ceramic Coating',
                'name_mk' => 'Керамичка Заштита',
                'slug' => 'ceramic-coating',
                'short_description' => 'Professional-grade ceramic coating for long-lasting paint protection and incredible gloss.',
                'short_description_mk' => 'Професионална керамичка заштита за долготрајна заштита на бојата и неверојатен сјај.',
                'description' => '<p>Our Ceramic Coating package provides the ultimate in paint protection. This multi-step process includes:</p><ul><li>Full exterior decontamination wash</li><li>Clay bar treatment</li><li>Multi-stage paint correction</li><li>IPA wipe-down</li><li>Professional ceramic coating application</li><li>24-hour curing period</li></ul><p>Our ceramic coatings last 2-5 years and provide unmatched protection against UV damage, chemical etching, and environmental contaminants.</p>',
                'description_mk' => '<p>Нашиот пакет за Керамичка Заштита обезбедува врвна заштита на бојата. Овој повеќестепен процес вклучува:</p><ul><li>Комплетно деконтаминирачко миење</li><li>Clay bar третман</li><li>Повеќестепена корекција на бојата</li><li>IPA бришење</li><li>Професионална апликација на керамички премаз</li><li>24-часовен период на стврднување</li></ul><p>Нашите керамички премази траат 2-5 години и обезбедуваат ненадмината заштита од UV зраци, хемиско нагризување и загадувачи.</p>',
                'price_from' => 599.99,
                'price_to' => 1499.99,
                'duration' => '1-2 days',
                'sort_order' => 3,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Paint Correction',
                'name_mk' => 'Корекција на Боја',
                'slug' => 'paint-correction',
                'short_description' => 'Multi-stage machine polishing to remove scratches, swirl marks, and oxidation.',
                'short_description_mk' => 'Повеќестепено машинско полирање за отстранување на гребнатини, swirl марки и оксидација.',
                'description' => '<p>Our Paint Correction service restores your paint to better-than-new condition:</p><ul><li>Thorough wash and decontamination</li><li>Paint thickness measurement</li><li>Multi-stage machine polishing</li><li>Defect removal (swirls, scratches, water spots)</li><li>Final inspection under specialized lighting</li><li>Sealant or coating application</li></ul>',
                'description_mk' => '<p>Нашата услуга за Корекција на Боја ја враќа бојата во подобра состојба од нова:</p><ul><li>Темелно миење и деконтаминација</li><li>Мерење на дебелина на боја</li><li>Повеќестепено машинско полирање</li><li>Отстранување на дефекти (swirl, гребнатини, водени дамки)</li><li>Финална инспекција под специјално осветлување</li><li>Апликација на силант или керамички премаз</li></ul>',
                'price_from' => 399.99,
                'price_to' => 899.99,
                'duration' => '6-10 hours',
                'sort_order' => 4,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Paint Protection Film',
                'name_mk' => 'Заштитна Фолија (PPF)',
                'slug' => 'paint-protection-film',
                'short_description' => 'Self-healing clear film to protect high-impact areas from rock chips and road debris.',
                'short_description_mk' => 'Само-лечечка транспарентна фолија за заштита на бојата од камчиња и оштетувања.',
                'description' => '<p>Our PPF installation protects your vehicle from the hazards of daily driving:</p><ul><li>Computer-cut precision templates</li><li>Self-healing clear film</li><li>Coverage options from partial to full body</li><li>10-year manufacturer warranty</li><li>Invisible protection that preserves your paint</li></ul>',
                'description_mk' => '<p>Нашата инсталација на PPF го заштитува вашето возило од опасностите на секојдневното возење:</p><ul><li>Компјутерски исечени прецизни шаблони</li><li>Само-лечечка транспарентна фолија</li><li>Опции за покривање од делумно до целосно тело</li><li>10-годишна гаранција од производителот</li><li>Невидлива заштита што ја зачувува вашата боја</li></ul>',
                'price_from' => 799.99,
                'price_to' => 5999.99,
                'duration' => '1-3 days',
                'sort_order' => 5,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Full Detail Package',
                'name_mk' => 'Комплетен Пакет',
                'slug' => 'full-detail-package',
                'short_description' => 'The complete package — interior, exterior, engine bay, and wheel detail all in one.',
                'short_description_mk' => 'Комплетен пакет — ентериер, екстериер, мотор и тркала, сè во едно.',
                'description' => '<p>Our Full Detail Package is the ultimate detailing experience:</p><ul><li>Complete exterior detail with clay bar and polish</li><li>Full interior deep clean</li><li>Engine bay cleaning</li><li>Wheel and tire detail</li><li>Premium sealant application</li><li>Interior protection coating</li></ul><p>This is our most comprehensive service, perfect for vehicles that need a complete transformation.</p>',
                'description_mk' => '<p>Нашиот Комплетен Пакет е врвното искуство за деталирање:</p><ul><li>Комплетно надворешно деталирање со clay bar и полирање</li><li>Длабинско чистење на ентериер</li><li>Чистење на мотор</li><li>Деталирање на тркала и гуми</li><li>Апликација на премиум силант</li><li>Заштитен премаз за ентериер</li></ul><p>Ова е нашата најкомплетна услуга, перфектна за возила кои имаат потреба од целосна трансформација.</p>',
                'price_from' => 349.99,
                'price_to' => 549.99,
                'duration' => '5-7 hours',
                'sort_order' => 6,
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // Portfolio Items (titles match real images in storage/portfolio/)
        $portfolioItems = [
            ['title' => 'Audi A5 Sportback Ceramic Coating', 'title_mk' => 'Audi A5 Sportback Керамичка Заштита', 'slug' => 'audi-a5-sportback-ceramic-coating', 'after_image' => 'portfolio/audi-black-front.webp', 'category' => 'Ceramic Coating', 'service_id' => 3, 'is_featured' => true, 'description' => 'Full paint correction and 5-year ceramic coating on this stunning black Audi A5 Sportback.', 'description_mk' => 'Комплетна корекција на боја и 5-годишна керамичка заштита на овој црн Audi A5 Sportback.'],
            ['title' => 'Ferrari F8 Tributo Full Detail', 'title_mk' => 'Ferrari F8 Tributo Комплетно Деталирање', 'slug' => 'ferrari-f8-tributo-full-detail', 'after_image' => 'portfolio/ferrari-rear.webp', 'category' => 'Full Detail', 'service_id' => 6, 'is_featured' => true, 'description' => 'Complete interior and exterior detail on this Rosso Corsa Ferrari F8 Tributo.', 'description_mk' => 'Комплетно внатрешно и надворешно деталирање на ова Rosso Corsa Ferrari F8 Tributo.'],
            ['title' => 'Red Audi S7 Paint Correction', 'title_mk' => 'Црвено Audi S7 Корекција на Боја', 'slug' => 'red-audi-s7-paint-correction', 'after_image' => 'portfolio/red-audi-front.webp', 'category' => 'Paint Correction', 'service_id' => 4, 'is_featured' => true, 'description' => 'Multi-stage paint correction on this red Audi S7, removing swirl marks to reveal deep gloss.', 'description_mk' => 'Повеќестепена корекција на боја на ова црвено Audi S7, отстранување на swirl марки за длабок сјај.'],
            ['title' => 'Mercedes GLE Coupe Ceramic Coating', 'title_mk' => 'Mercedes GLE Coupe Керамичка Заштита', 'slug' => 'mercedes-gle-coupe-ceramic', 'after_image' => 'portfolio/gallery-01.webp', 'category' => 'Ceramic Coating', 'service_id' => 3, 'is_featured' => true, 'description' => 'Professional ceramic coating on this black Mercedes GLE Coupe. Mirror-like reflections under studio lights.', 'description_mk' => 'Професионална керамичка заштита на овој црн Mercedes GLE Coupe. Огледални рефлексии под студиски светла.'],
            ['title' => 'Audi A5 Sportback Exterior Detail', 'title_mk' => 'Audi A5 Sportback Надворешно Деталирање', 'slug' => 'audi-a5-exterior-detail', 'after_image' => 'portfolio/audi-black-side.webp', 'category' => 'Exterior Detail', 'service_id' => 1, 'is_featured' => true, 'description' => 'Complete exterior wash, clay bar, and sealant on this sleek black Audi A5 Sportback.', 'description_mk' => 'Комплетно надворешно миење, clay bar и силант на овој елегантен црн Audi A5 Sportback.'],
            ['title' => 'BMW Interior Restoration', 'title_mk' => 'BMW Реставрација на Ентериер', 'slug' => 'bmw-interior-restoration', 'after_image' => 'portfolio/bmw-interior-steering.webp', 'category' => 'Interior Detail', 'service_id' => 2, 'is_featured' => true, 'description' => 'Full leather restoration and interior deep clean on this BMW. Every surface meticulously cleaned.', 'description_mk' => 'Комплетна реставрација на кожа и длабинско чистење на ентериерот на ова BMW.'],
            ['title' => 'Mercedes GLE Coupe PPF', 'title_mk' => 'Mercedes GLE Coupe Заштитна Фолија', 'slug' => 'mercedes-gle-ppf', 'after_image' => 'portfolio/gallery-04.webp', 'category' => 'Paint Protection Film', 'service_id' => 5, 'is_featured' => true, 'description' => 'Full front end paint protection film on this Mercedes GLE Coupe.', 'description_mk' => 'Комплетна заштитна фолија на предниот дел на овој Mercedes GLE Coupe.'],
            ['title' => 'Ferrari F8 Ceramic Coating', 'title_mk' => 'Ferrari F8 Керамичка Заштита', 'slug' => 'ferrari-f8-ceramic', 'after_image' => 'portfolio/ferrari-01.webp', 'category' => 'Ceramic Coating', 'service_id' => 3, 'is_featured' => true, 'description' => 'Premium ceramic coating on this red Ferrari F8 Tributo with incredible depth.', 'description_mk' => 'Премиум керамичка заштита на ова црвено Ferrari F8 Tributo со неверојатна длабочина.'],
            ['title' => 'Audi A5 Engine Bay Detail', 'title_mk' => 'Audi A5 Деталирање на Мотор', 'slug' => 'audi-a5-engine-bay', 'after_image' => 'portfolio/audi-black-engine.webp', 'category' => 'Full Detail', 'service_id' => 6, 'is_featured' => false, 'description' => 'Engine bay cleaning and dressing on this Audi A5 Sportback as part of our full detail package.', 'description_mk' => 'Чистење и дотерување на моторен простор на Audi A5 Sportback како дел од комплетниот пакет.'],
        ];

        foreach ($portfolioItems as $index => $item) {
            PortfolioItem::create(array_merge($item, ['sort_order' => $index, 'is_active' => true]));
        }

        // Testimonials
        $testimonials = [
            ['client_name' => 'James Mitchell', 'client_vehicle' => '2023 BMW M5', 'content' => 'Absolutely incredible work! My M5 looks better than when I picked it up from the dealer. The ceramic coating has an unreal depth and gloss. Highly recommend Limitless!', 'content_mk' => 'Апсолутно неверојатна работа! Мојот M5 изгледа подобро отколку кога го подигнав од салонот. Керамичката заштита има нереален сјај. Го препорачувам Limitless!', 'rating' => 5, 'is_featured' => true],
            ['client_name' => 'Sarah Williams', 'client_vehicle' => '2024 Mercedes GLE', 'content' => 'The interior detail was phenomenal. Every surface was spotless, and the leather feels brand new. The attention to detail is second to none.', 'content_mk' => 'Внатрешното деталирање беше феноменално. Секоја површина беше безгрешна, а кожата се чувствува како нова. Вниманието на деталите е ненадминато.', 'rating' => 5, 'is_featured' => true],
            ['client_name' => 'Michael Chen', 'client_vehicle' => '2022 Porsche 911 GT3', 'content' => 'I trusted them with my GT3 and they delivered beyond expectations. The paint correction removed every swirl mark. True professionals who care about their craft.', 'content_mk' => 'Им го доверив мојот GT3 и тие испорачаа над очекувањата. Корекцијата на бојата ги отстрани сите swirl марки. Вистински професионалци.', 'rating' => 5, 'is_featured' => true],
            ['client_name' => 'Emily Rodriguez', 'client_vehicle' => '2023 Tesla Model Y', 'content' => 'Quick, professional, and the results speak for themselves. My Tesla looks absolutely stunning after the full detail. Will definitely be coming back!', 'content_mk' => 'Брзо, професионално, и резултатите зборуваат сами за себе. Мојата Tesla изгледа апсолутно неверојатно. Дефинитивно ќе се вратам!', 'rating' => 5, 'is_featured' => true],
            ['client_name' => 'David Thompson', 'client_vehicle' => '2021 Audi RS6', 'content' => 'Best detailing service I have ever used. The PPF installation was flawless — you cannot even tell it is there. Worth every penny for the peace of mind.', 'content_mk' => 'Најдобра услуга за деталирање што сум ја користел. Инсталацијата на PPF беше беспрекорна — воопшто не се забележува. Вреди секој денар.', 'rating' => 5, 'is_featured' => true],
            ['client_name' => 'Lisa Park', 'client_vehicle' => '2024 Range Rover Sport', 'content' => 'The team at Limitless transformed my Range Rover. From the exterior polish to the interior deep clean, everything was executed perfectly. Five stars all the way!', 'content_mk' => 'Тимот на Limitless го трансформираше мојот Range Rover. Од надворешното полирање до длабинското чистење на ентериерот, сè беше извршено перфектно. Пет ѕвезди!', 'rating' => 5, 'is_featured' => true],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create(array_merge($testimonial, ['is_active' => true]));
        }

        // Sample Bookings
        $bookings = [
            ['client_name' => 'John Smith', 'client_email' => 'john@example.com', 'client_phone' => '(555) 111-2222', 'vehicle_make' => 'BMW', 'vehicle_model' => 'X5', 'vehicle_year' => '2023', 'service_id' => 1, 'preferred_date' => now()->addDays(3), 'preferred_time' => '10:00', 'status' => 'pending', 'message' => 'First time customer. Looking for a thorough exterior detail.'],
            ['client_name' => 'Anna Johnson', 'client_email' => 'anna@example.com', 'client_phone' => '(555) 333-4444', 'vehicle_make' => 'Mercedes', 'vehicle_model' => 'C300', 'vehicle_year' => '2022', 'service_id' => 3, 'preferred_date' => now()->addDays(5), 'preferred_time' => '09:00', 'status' => 'confirmed', 'message' => 'Interested in ceramic coating. Would like to discuss options.'],
            ['client_name' => 'Robert Davis', 'client_email' => 'robert@example.com', 'client_phone' => '(555) 555-6666', 'vehicle_make' => 'Tesla', 'vehicle_model' => 'Model 3', 'vehicle_year' => '2024', 'service_id' => 6, 'preferred_date' => now()->addDays(1), 'preferred_time' => '11:00', 'status' => 'pending'],
        ];

        foreach ($bookings as $booking) {
            Booking::create($booking);
        }

        // Site Content (all page text, editable from admin)
        $contents = [
            // Hero section
            ['key' => 'hero.badge', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Premium Auto Detailing', 'value_mk' => 'Премиум Авто Деталинг'],
            ['key' => 'hero.title1', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Perfection', 'value_mk' => 'Перфекција'],
            ['key' => 'hero.title2', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'in Every', 'value_mk' => 'во Секој'],
            ['key' => 'hero.title3', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Detail', 'value_mk' => 'Детал'],
            ['key' => 'hero.subtitle', 'page' => 'home', 'section' => 'hero', 'type' => 'textarea', 'value_en' => "Where artistry meets automotive excellence. We don't just clean cars — we craft experiences that redefine what your vehicle can look like.", 'value_mk' => 'Каде уметноста се среќава со автомобилската извонредност. Ние не само што чистиме автомобили — ние создаваме искуства кои го редефинираат изгледот на вашето возило.'],
            ['key' => 'hero.cta', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Book Your Detail', 'value_mk' => 'Закажи Деталинг'],
            ['key' => 'hero.ctaSecondary', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Explore Services', 'value_mk' => 'Разгледај Услуги'],

            // Services section (home)
            ['key' => 'services.label', 'page' => 'home', 'section' => 'services', 'type' => 'text', 'value_en' => 'What We Offer', 'value_mk' => 'Што Нудиме'],
            ['key' => 'services.title', 'page' => 'home', 'section' => 'services', 'type' => 'text', 'value_en' => 'Premium', 'value_mk' => 'Премиум'],
            ['key' => 'services.titleAccent', 'page' => 'home', 'section' => 'services', 'type' => 'text', 'value_en' => 'Services', 'value_mk' => 'Услуги'],

            // Showcase section
            ['key' => 'showcase.label', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Why Choose Us', 'value_mk' => 'Зошто Нас'],
            ['key' => 'showcase.title1', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Where Obsession', 'value_mk' => 'Каде Опсесијата'],
            ['key' => 'showcase.title2', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Meets', 'value_mk' => 'Среќава'],
            ['key' => 'showcase.titleAccent', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Precision', 'value_mk' => 'Прецизност'],
            ['key' => 'showcase.feature1.title', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Certified Master Detailers', 'value_mk' => 'Сертифицирани Мајстори'],
            ['key' => 'showcase.feature1.description', 'page' => 'home', 'section' => 'showcase', 'type' => 'textarea', 'value_en' => 'IDA-certified professionals with 10,000+ hours of hands-on experience.', 'value_mk' => 'IDA-сертифицирани професионалци со 10,000+ часови практично искуство.'],
            ['key' => 'showcase.feature2.title', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Laboratory-Grade Products', 'value_mk' => 'Лабораториски Производи'],
            ['key' => 'showcase.feature2.description', 'page' => 'home', 'section' => 'showcase', 'type' => 'textarea', 'value_en' => 'We use only Gtechniq, Gyeon, and CarPro — the finest products in the industry.', 'value_mk' => 'Користиме само Gtechniq, Gyeon и CarPro — најфините производи во индустријата.'],
            ['key' => 'showcase.feature3.title', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => '100% Satisfaction Promise', 'value_mk' => '100% Гаранција за Задоволство'],
            ['key' => 'showcase.feature3.description', 'page' => 'home', 'section' => 'showcase', 'type' => 'textarea', 'value_en' => "Not happy? We re-do the work at no cost. No questions asked.", 'value_mk' => 'Не сте задоволни? Повторно го работиме бесплатно. Без прашања.'],
            ['key' => 'showcase.feature4.title', 'page' => 'home', 'section' => 'showcase', 'type' => 'text', 'value_en' => 'Concierge Scheduling', 'value_mk' => 'Конциерж Закажување'],
            ['key' => 'showcase.feature4.description', 'page' => 'home', 'section' => 'showcase', 'type' => 'textarea', 'value_en' => 'We pick up and deliver your vehicle. Detailing has never been this effortless.', 'value_mk' => 'Го земаме и доставуваме вашето возило. Деталингот никогаш не бил полесен.'],

            // Stats
            ['key' => 'stats.cars.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '2,400+', 'value_mk' => '2,400+'],
            ['key' => 'stats.cars.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Cars Perfected', 'value_mk' => 'Усовршени Возила'],
            ['key' => 'stats.clients.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '650+', 'value_mk' => '650+'],
            ['key' => 'stats.clients.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Happy Clients', 'value_mk' => 'Задоволни Клиенти'],
            ['key' => 'stats.years.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '12', 'value_mk' => '12'],
            ['key' => 'stats.years.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Years of Craft', 'value_mk' => 'Години Искуство'],
            ['key' => 'stats.rating.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '4.9', 'value_mk' => '4.9'],
            ['key' => 'stats.rating.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Google Rating', 'value_mk' => 'Google Оценка'],

            // Portfolio section (home)
            ['key' => 'portfolio.label', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'Our Work', 'value_mk' => 'Наша Работа'],
            ['key' => 'portfolio.title', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'Recent', 'value_mk' => 'Неодамнешни'],
            ['key' => 'portfolio.titleAccent', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'Transformations', 'value_mk' => 'Трансформации'],
            ['key' => 'portfolio.viewAll', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'View Full Portfolio', 'value_mk' => 'Целосно Портфолио'],

            // Testimonials section (home)
            ['key' => 'testimonials.label', 'page' => 'home', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Testimonials', 'value_mk' => 'Искуства'],
            ['key' => 'testimonials.title', 'page' => 'home', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Client', 'value_mk' => 'Клиентски'],
            ['key' => 'testimonials.titleAccent', 'page' => 'home', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Experiences', 'value_mk' => 'Искуства'],

            // CTA section
            ['key' => 'cta.title1', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Ready to Experience', 'value_mk' => 'Подготвени за'],
            ['key' => 'cta.titleAccent', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'The Difference?', 'value_mk' => 'Разликата?'],
            ['key' => 'cta.subtitle', 'page' => 'home', 'section' => 'cta', 'type' => 'textarea', 'value_en' => 'Your vehicle deserves more than a wash. It deserves a transformation. Book now and let us show you what Limitless truly means.', 'value_mk' => 'Вашето возило заслужува повеќе од миење. Заслужува трансформација. Закажете сега и дозволете ни да ви покажеме што навистина значи Limitless.'],
            ['key' => 'cta.button', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Book Now', 'value_mk' => 'Закажи Сега'],
            ['key' => 'cta.buttonSecondary', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'View Services', 'value_mk' => 'Види Услуги'],

            // Footer
            ['key' => 'footer.tagline', 'page' => 'global', 'section' => 'footer', 'type' => 'textarea', 'value_en' => 'Where artistry meets automotive excellence. Premium detailing services that redefine what your vehicle can look like.', 'value_mk' => 'Каде уметноста се среќава со автомобилската извонредност. Премиум деталинг услуги кои го редефинираат вашето возило.'],
            ['key' => 'footer.phone', 'page' => 'global', 'section' => 'footer', 'type' => 'text', 'value_en' => '+389 70 123 456', 'value_mk' => '+389 70 123 456'],
            ['key' => 'footer.email', 'page' => 'global', 'section' => 'footer', 'type' => 'text', 'value_en' => 'info@limitlessdetailing.mk', 'value_mk' => 'info@limitlessdetailing.mk'],
            ['key' => 'footer.address', 'page' => 'global', 'section' => 'footer', 'type' => 'text', 'value_en' => 'Skopje, North Macedonia', 'value_mk' => 'Скопје, Северна Македонија'],

            // Services page
            ['key' => 'servicesPage.label', 'page' => 'services', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Our Services', 'value_mk' => 'Наши Услуги'],
            ['key' => 'servicesPage.title', 'page' => 'services', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Premium Detailing', 'value_mk' => 'Премиум Деталинг'],
            ['key' => 'servicesPage.titleAccent', 'page' => 'services', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Services', 'value_mk' => 'Услуги'],
            ['key' => 'servicesPage.subtitle', 'page' => 'services', 'section' => 'hero', 'type' => 'textarea', 'value_en' => 'From basic washes to full ceramic coatings, we offer a comprehensive range of detailing services to keep your vehicle looking its absolute best.', 'value_mk' => 'Од основно миење до целосна керамичка заштита, нудиме широк спектар на деталинг услуги за вашето возило да изгледа совршено.'],
            ['key' => 'servicesPage.ctaTitle', 'page' => 'services', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Not Sure Which Service You Need?', 'value_mk' => 'Не сте сигурни која услуга ви треба?'],
            ['key' => 'servicesPage.ctaText', 'page' => 'services', 'section' => 'cta', 'type' => 'textarea', 'value_en' => 'Contact us and our team will recommend the perfect package for your vehicle.', 'value_mk' => 'Контактирајте нè и нашиот тим ќе ви препорача совршен пакет за вашето возило.'],
            ['key' => 'servicesPage.ctaButton', 'page' => 'services', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Get a Free Quote', 'value_mk' => 'Бесплатна Понуда'],

            // Portfolio page
            ['key' => 'portfolioPage.label', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Our Work', 'value_mk' => 'Наша Работа'],
            ['key' => 'portfolioPage.title', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Portfolio', 'value_mk' => 'Портфолио'],
            ['key' => 'portfolioPage.titleAccent', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Gallery', 'value_mk' => 'Галерија'],
            ['key' => 'portfolioPage.subtitle', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'textarea', 'value_en' => 'Browse our recent projects and see the transformations we create for our clients.', 'value_mk' => 'Прегледајте ги нашите неодамнешни проекти и видете ги трансформациите што ги создаваме за нашите клиенти.'],

            // About page
            ['key' => 'aboutPage.label', 'page' => 'about', 'section' => 'hero', 'type' => 'text', 'value_en' => 'About Us', 'value_mk' => 'За Нас'],
            ['key' => 'aboutPage.title', 'page' => 'about', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Our', 'value_mk' => 'Нашата'],
            ['key' => 'aboutPage.titleAccent', 'page' => 'about', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Story', 'value_mk' => 'Приказна'],
            ['key' => 'aboutPage.subtitle', 'page' => 'about', 'section' => 'hero', 'type' => 'textarea', 'value_en' => 'Passionate about perfection since day one. Learn what drives us to deliver exceptional results every single time.', 'value_mk' => 'Страствени кон перфекција од првиот ден. Дознајте што нè мотивира да испорачуваме исклучителни резултати секој пат.'],
            ['key' => 'aboutPage.storyTitle', 'page' => 'about', 'section' => 'story', 'type' => 'text', 'value_en' => 'Where Passion Meets', 'value_mk' => 'Каде Страста Среќава'],
            ['key' => 'aboutPage.storyTitleAccent', 'page' => 'about', 'section' => 'story', 'type' => 'text', 'value_en' => 'Precision', 'value_mk' => 'Прецизност'],
            ['key' => 'aboutPage.storyP1', 'page' => 'about', 'section' => 'story', 'type' => 'textarea', 'value_en' => "Limitless Auto Detailing was born from a simple belief: every vehicle deserves to look its absolute best. What started as a one-man operation in a small garage has grown into the region's premier auto detailing service.", 'value_mk' => 'Limitless Auto Detailing е создаден од едноставно верување: секое возило заслужува да изгледа најдобро. Она што започна како операција на еден човек во мала гаража, прерасна во премиер деталинг сервис во регионот.'],
            ['key' => 'aboutPage.storyP2', 'page' => 'about', 'section' => 'story', 'type' => 'textarea', 'value_en' => "Our team of certified professionals uses only the highest quality products and the latest techniques to transform your vehicle. Whether it's a daily driver or a show car, we treat every vehicle with the same meticulous attention to detail.", 'value_mk' => 'Нашиот тим од сертифицирани професионалци користи само највисококвалитетни производи и најнови техники за трансформација на вашето возило. Без разлика дали е секојдневен автомобил или шоу кар, секое возило го третираме со исто внимание кон деталите.'],
            ['key' => 'aboutPage.storyP3', 'page' => 'about', 'section' => 'story', 'type' => 'textarea', 'value_en' => "We're not just about making cars look good — we're about protecting your investment and helping you fall in love with your vehicle all over again.", 'value_mk' => 'Ние не сме само за тоа автомобилите да изгледаат добро — ние сме за заштита на вашата инвестиција и да ви помогнеме повторно да се вљубите во вашето возило.'],
            ['key' => 'aboutPage.valuesLabel', 'page' => 'about', 'section' => 'values', 'type' => 'text', 'value_en' => 'Our Values', 'value_mk' => 'Наши Вредности'],
            ['key' => 'aboutPage.valuesTitle', 'page' => 'about', 'section' => 'values', 'type' => 'text', 'value_en' => 'What Drives Us', 'value_mk' => 'Што Нè Движи'],
            ['key' => 'aboutPage.value1.title', 'page' => 'about', 'section' => 'values', 'type' => 'text', 'value_en' => 'Excellence', 'value_mk' => 'Извонредност'],
            ['key' => 'aboutPage.value1.description', 'page' => 'about', 'section' => 'values', 'type' => 'textarea', 'value_en' => 'We never cut corners. Every detail matters, and we pursue perfection in everything we do.', 'value_mk' => 'Никогаш не правиме компромиси. Секој детал е важен и се стремиме кон перфекција во сè што правиме.'],
            ['key' => 'aboutPage.value2.title', 'page' => 'about', 'section' => 'values', 'type' => 'text', 'value_en' => 'Integrity', 'value_mk' => 'Интегритет'],
            ['key' => 'aboutPage.value2.description', 'page' => 'about', 'section' => 'values', 'type' => 'textarea', 'value_en' => 'Honest pricing, transparent processes, and always delivering on our promises to our clients.', 'value_mk' => 'Чесни цени, транспарентни процеси и секогаш исполнување на ветувањата кон нашите клиенти.'],
            ['key' => 'aboutPage.value3.title', 'page' => 'about', 'section' => 'values', 'type' => 'text', 'value_en' => 'Innovation', 'value_mk' => 'Иновација'],
            ['key' => 'aboutPage.value3.description', 'page' => 'about', 'section' => 'values', 'type' => 'textarea', 'value_en' => 'We stay ahead of the curve with the latest products, techniques, and technology in auto detailing.', 'value_mk' => 'Секогаш сме чекор напред со најновите производи, техники и технологија во авто деталингот.'],

            // Contact page
            ['key' => 'contactPage.label', 'page' => 'contact', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Get In Touch', 'value_mk' => 'Контактирајте'],
            ['key' => 'contactPage.title', 'page' => 'contact', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Book Your', 'value_mk' => 'Закажете Ваш'],
            ['key' => 'contactPage.titleAccent', 'page' => 'contact', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Detail', 'value_mk' => 'Деталинг'],
            ['key' => 'contactPage.subtitle', 'page' => 'contact', 'section' => 'hero', 'type' => 'textarea', 'value_en' => "Ready to transform your vehicle? Fill out the form below and we'll get back to you within 24 hours.", 'value_mk' => 'Подготвени да го трансформирате вашето возило? Пополнете го формуларот подолу и ќе ви одговориме во рок од 24 часа.'],
            ['key' => 'contactPage.hours.monFri', 'page' => 'contact', 'section' => 'hours', 'type' => 'text', 'value_en' => '8:00 AM - 6:00 PM', 'value_mk' => '8:00 - 18:00'],
            ['key' => 'contactPage.hours.saturday', 'page' => 'contact', 'section' => 'hours', 'type' => 'text', 'value_en' => '9:00 AM - 4:00 PM', 'value_mk' => '9:00 - 16:00'],
            ['key' => 'contactPage.hours.sunday', 'page' => 'contact', 'section' => 'hours', 'type' => 'text', 'value_en' => 'Closed', 'value_mk' => 'Затворено'],
        ];

        foreach ($contents as $i => $content) {
            SiteContent::create(array_merge($content, ['sort_order' => $i]));
        }
    }
}
