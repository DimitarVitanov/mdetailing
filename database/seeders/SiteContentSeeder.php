<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            ['key' => 'hero.badge', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Premium Auto Detailing', 'value_mk' => 'Премиум Авто Деталинг'],
            ['key' => 'hero.title1', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Premium', 'value_mk' => 'Премиум'],
            ['key' => 'hero.title2', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Care for Every', 'value_mk' => 'Нега за Секој'],
            ['key' => 'hero.title3', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Vehicle', 'value_mk' => 'Автомобил'],
            ['key' => 'hero.subtitle', 'page' => 'home', 'section' => 'hero', 'type' => 'textarea', 'value_en' => "Where artistry meets automotive excellence. We don't just clean cars — we craft experiences that redefine what your vehicle can look like.", 'value_mk' => 'Детално внатрешно и надворешно чистење, полирање во 3 фази, керамичка заштита и полирање на фарови.'],
            ['key' => 'hero.cta', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Book Your Detail', 'value_mk' => 'Закажи Деталинг'],
            ['key' => 'hero.ctaSecondary', 'page' => 'home', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Explore Services', 'value_mk' => 'Разгледај Услуги'],
            ['key' => 'services.label', 'page' => 'home', 'section' => 'services', 'type' => 'text', 'value_en' => 'What We Offer', 'value_mk' => 'Што Нудиме'],
            ['key' => 'services.title', 'page' => 'home', 'section' => 'services', 'type' => 'text', 'value_en' => 'Premium', 'value_mk' => 'Премиум'],
            ['key' => 'services.titleAccent', 'page' => 'home', 'section' => 'services', 'type' => 'text', 'value_en' => 'Services', 'value_mk' => 'Услуги'],
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
            ['key' => 'stats.cars.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '2,400+', 'value_mk' => '2,400+'],
            ['key' => 'stats.cars.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Cars Perfected', 'value_mk' => 'Усовршени Возила'],
            ['key' => 'stats.clients.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '650+', 'value_mk' => '650+'],
            ['key' => 'stats.clients.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Happy Clients', 'value_mk' => 'Задоволни Клиенти'],
            ['key' => 'stats.years.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '12', 'value_mk' => '12'],
            ['key' => 'stats.years.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Years of Craft', 'value_mk' => 'Години Искуство'],
            ['key' => 'stats.rating.value', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => '4.9', 'value_mk' => '4.9'],
            ['key' => 'stats.rating.label', 'page' => 'home', 'section' => 'stats', 'type' => 'text', 'value_en' => 'Google Rating', 'value_mk' => 'Google Оценка'],
            ['key' => 'portfolio.label', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'Our Work', 'value_mk' => 'Наша Работа'],
            ['key' => 'portfolio.title', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'Recent', 'value_mk' => 'Неодамнешни'],
            ['key' => 'portfolio.titleAccent', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'Transformations', 'value_mk' => 'Трансформации'],
            ['key' => 'portfolio.viewAll', 'page' => 'home', 'section' => 'portfolio', 'type' => 'text', 'value_en' => 'View Full Portfolio', 'value_mk' => 'Целосно Портфолио'],
            ['key' => 'testimonials.label', 'page' => 'home', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Testimonials', 'value_mk' => 'Искуства'],
            ['key' => 'testimonials.title', 'page' => 'home', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Client', 'value_mk' => 'Клиентски'],
            ['key' => 'testimonials.titleAccent', 'page' => 'home', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Experiences', 'value_mk' => 'Искуства'],
            ['key' => 'cta.title1', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Ready to Experience', 'value_mk' => 'Подготвени за'],
            ['key' => 'cta.titleAccent', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'The Difference?', 'value_mk' => 'Разликата?'],
            ['key' => 'cta.subtitle', 'page' => 'home', 'section' => 'cta', 'type' => 'textarea', 'value_en' => 'Your vehicle deserves more than a wash. It deserves a transformation. Book now and let us show you what Limitless truly means.', 'value_mk' => 'Вашето возило заслужува повеќе од миење. Заслужува трансформација. Закажете сега и дозволете ни да ви покажеме што навистина значи Limitless.'],
            ['key' => 'cta.button', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Book Now', 'value_mk' => 'Закажи Сега'],
            ['key' => 'cta.buttonSecondary', 'page' => 'home', 'section' => 'cta', 'type' => 'text', 'value_en' => 'View Services', 'value_mk' => 'Види Услуги'],
            ['key' => 'footer.tagline', 'page' => 'global', 'section' => 'footer', 'type' => 'textarea', 'value_en' => 'Where artistry meets automotive excellence. Premium detailing services that redefine what your vehicle can look like.', 'value_mk' => 'Каде уметноста се среќава со автомобилската извонредност. Премиум деталинг услуги кои го редефинираат вашето возило.'],
            ['key' => 'footer.phone', 'page' => 'global', 'section' => 'footer', 'type' => 'text', 'value_en' => '+389 70 123 456', 'value_mk' => '+389 70 123 456'],
            ['key' => 'footer.email', 'page' => 'global', 'section' => 'footer', 'type' => 'text', 'value_en' => 'info@limitlessdetailing.mk', 'value_mk' => 'info@limitlessdetailing.mk'],
            ['key' => 'footer.address', 'page' => 'global', 'section' => 'footer', 'type' => 'text', 'value_en' => 'Skopje, North Macedonia', 'value_mk' => 'Скопје, Северна Македонија'],
            ['key' => 'servicesPage.label', 'page' => 'services', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Our Services', 'value_mk' => 'Наши Услуги'],
            ['key' => 'servicesPage.title', 'page' => 'services', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Premium Detailing', 'value_mk' => 'Премиум Деталинг'],
            ['key' => 'servicesPage.titleAccent', 'page' => 'services', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Services', 'value_mk' => 'Услуги'],
            ['key' => 'servicesPage.subtitle', 'page' => 'services', 'section' => 'hero', 'type' => 'textarea', 'value_en' => 'From basic washes to full ceramic coatings, we offer a comprehensive range of detailing services to keep your vehicle looking its absolute best.', 'value_mk' => 'Од основно миење до целосна керамичка заштита, нудиме широк спектар на деталинг услуги за вашето возило да изгледа совршено.'],
            ['key' => 'servicesPage.ctaTitle', 'page' => 'services', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Not Sure Which Service You Need?', 'value_mk' => 'Не сте сигурни која услуга ви треба?'],
            ['key' => 'servicesPage.ctaText', 'page' => 'services', 'section' => 'cta', 'type' => 'textarea', 'value_en' => 'Contact us and our team will recommend the perfect package for your vehicle.', 'value_mk' => 'Контактирајте нè и нашиот тим ќе ви препорача совршен пакет за вашето возило.'],
            ['key' => 'servicesPage.ctaButton', 'page' => 'services', 'section' => 'cta', 'type' => 'text', 'value_en' => 'Get a Free Quote', 'value_mk' => 'Бесплатна Понуда'],
            ['key' => 'portfolioPage.label', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Our Work', 'value_mk' => 'Наша Работа'],
            ['key' => 'portfolioPage.title', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Portfolio', 'value_mk' => 'Портфолио'],
            ['key' => 'portfolioPage.titleAccent', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Gallery', 'value_mk' => 'Галерија'],
            ['key' => 'portfolioPage.subtitle', 'page' => 'portfolio', 'section' => 'hero', 'type' => 'textarea', 'value_en' => 'Browse our recent projects and see the transformations we create for our clients.', 'value_mk' => 'Прегледајте ги нашите неодамнешни проекти и видете ги трансформациите што ги создаваме за нашите клиенти.'],
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
            ['key' => 'aboutPage.testimonialsLabel', 'page' => 'about', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Testimonials', 'value_mk' => 'Искуства'],
            ['key' => 'aboutPage.testimonialsTitle', 'page' => 'about', 'section' => 'testimonials', 'type' => 'text', 'value_en' => 'Client Reviews', 'value_mk' => 'Клиентски Рецензии'],
            ['key' => 'contactPage.label', 'page' => 'contact', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Get In Touch', 'value_mk' => 'Контактирајте'],
            ['key' => 'contactPage.title', 'page' => 'contact', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Book Your', 'value_mk' => 'Закажете Ваш'],
            ['key' => 'contactPage.titleAccent', 'page' => 'contact', 'section' => 'hero', 'type' => 'text', 'value_en' => 'Detail', 'value_mk' => 'Деталинг'],
            ['key' => 'contactPage.subtitle', 'page' => 'contact', 'section' => 'hero', 'type' => 'textarea', 'value_en' => "Ready to transform your vehicle? Fill out the form below and we'll get back to you within 24 hours.", 'value_mk' => 'Подготвени да го трансформирате вашето возило? Пополнете го формуларот подолу и ќе ви одговориме во рок од 24 часа.'],
            ['key' => 'contactPage.hours.monFri', 'page' => 'contact', 'section' => 'hours', 'type' => 'text', 'value_en' => '8:00 AM - 6:00 PM', 'value_mk' => '8:00 - 18:00'],
            ['key' => 'contactPage.hours.saturday', 'page' => 'contact', 'section' => 'hours', 'type' => 'text', 'value_en' => '9:00 AM - 4:00 PM', 'value_mk' => '9:00 - 16:00'],
            ['key' => 'contactPage.hours.sunday', 'page' => 'contact', 'section' => 'hours', 'type' => 'text', 'value_en' => 'Closed', 'value_mk' => 'Затворено'],
        ];

        foreach ($contents as $i => $content) {
            SiteContent::updateOrCreate(
                ['key' => $content['key']],
                array_merge($content, ['sort_order' => $i])
            );
        }
    }
}
