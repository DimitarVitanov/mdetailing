import { computed, reactive } from 'vue';
import { router, usePage } from '@inertiajs/vue3';

// Interface texts. Texts the client edits in the admin (Content) come from the `siteContent`
// prop through c(), which falls back to these when a key isn't in the database yet.
const translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            portfolio: 'Portfolio',
            about: 'About',
            contact: 'Contact',
            bookNow: 'Book Now',
        },
        hero: {
            badge: 'Premium Auto Detailing',
            title1: 'Premium',
            title2: 'Care for Every',
            title3: 'Vehicle',
            subtitle: "Where artistry meets automotive excellence. We don't just clean cars — we craft experiences that redefine what your vehicle can look like.",
            cta: 'Book Your Detail',
            ctaSecondary: 'Explore Services',
        },
        services: {
            label: 'What We Offer',
            title: 'Premium',
            titleAccent: 'Services',
            note: 'Prices may vary depending on the condition of the vehicle.',
            viewAll: 'View All',
            popular: 'Popular',
            from: 'From',
        },
        showcase: {
            label: 'Why Choose Us',
            title1: 'Where Obsession',
            title2: 'Meets',
            titleAccent: 'Precision',
            features: [
                { title: 'Certified Master Detailers', description: 'IDA-certified professionals with 10,000+ hours of hands-on experience.' },
                { title: 'Laboratory-Grade Products', description: 'We use only Gtechniq, Gyeon, and CarPro — the finest products in the industry.' },
                { title: '100% Satisfaction Promise', description: "Not happy? We re-do the work at no cost. No questions asked." },
            ],
        },
        stats: {
            cars: 'Cars Perfected',
            clients: 'Happy Clients',
            years: 'Years of Craft',
            rating: 'Google Rating',
        },
        portfolio: {
            label: 'Our Work',
            title: 'Recent',
            titleAccent: 'Transformations',
            viewAll: 'View Full Portfolio',
        },
        testimonials: {
            label: 'Testimonials',
            title: 'Client',
            titleAccent: 'Experiences',
        },
        cta: {
            title1: 'Ready to Experience',
            titleAccent: 'The Difference?',
            subtitle: 'Your vehicle deserves more than a wash. It deserves a transformation. Book now and let us show you what MDetailing truly means.',
            button: 'Book Now',
            buttonSecondary: 'View Services',
        },
        footer: {
            tagline: 'Where artistry meets automotive excellence. Premium detailing services that redefine what your vehicle can look like.',
            navigate: 'Navigate',
            services: 'Services',
            getInTouch: 'Get In Touch',
            rights: 'All rights reserved.',
            crafted: 'Crafted with precision.',
            ceramicCoating: 'Ceramic Coating',
            paintCorrection: 'Paint Correction',
            ppf: 'Paint Protection Film',
            interiorExterior: 'Interior & Exterior Detail',
        },
        marquee: ['Ceramic Coating', 'Paint Correction', 'PPF Installation', 'Interior Detail', 'Exterior Detail', 'Full Detail'],
        servicesPage: {
            label: 'Our Services',
            title: 'Premium Detailing',
            titleAccent: 'Services',
            subtitle: 'From basic washes to full ceramic coatings, we offer a comprehensive range of detailing services to keep your vehicle looking its absolute best.',
            popular: 'POPULAR',
            learnMore: 'Learn More',
            ctaTitle: 'Not Sure Which Service You Need?',
            ctaText: 'Contact us and our team will recommend the perfect package for your vehicle.',
            ctaButton: 'Get a Free Quote',
        },
        portfolioPage: {
            label: 'Our Work',
            title: 'Portfolio',
            titleAccent: 'Gallery',
            subtitle: 'Browse our recent projects and see the transformations we create for our clients.',
            all: 'All',
            noItems: 'No portfolio items found.',
            before: 'Before',
            after: 'After',
        },
        aboutPage: {
            label: 'About Us',
            title: 'Our',
            titleAccent: 'Story',
            subtitle: 'Passionate about perfection since day one. Learn what drives us to deliver exceptional results every single time.',
            storyTitle: 'Where Passion Meets',
            storyTitleAccent: 'Precision',
            storyP1: 'MDetailing was born from a simple belief: every vehicle deserves to look its absolute best. What started as a one-man operation in a small garage has grown into the region\'s premier auto detailing service.',
            storyP2: 'Our team of certified professionals uses only the highest quality products and the latest techniques to transform your vehicle. Whether it\'s a daily driver or a show car, we treat every vehicle with the same meticulous attention to detail.',
            storyP3: 'We\'re not just about making cars look good — we\'re about protecting your investment and helping you fall in love with your vehicle all over again.',
            valuesLabel: 'Our Values',
            valuesTitle: 'What Drives Us',
            values: [
                { title: 'Excellence', description: 'We never cut corners. Every detail matters, and we pursue perfection in everything we do.' },
                { title: 'Integrity', description: 'Honest pricing, transparent processes, and always delivering on our promises to our clients.' },
                { title: 'Innovation', description: 'We stay ahead of the curve with the latest products, techniques, and technology in auto detailing.' },
            ],
            testimonialsLabel: 'Testimonials',
            testimonialsTitle: 'Client Reviews',
        },
        contactPage: {
            label: 'Get In Touch',
            title: 'Book Your',
            titleAccent: 'Detail',
            subtitle: 'Ready to transform your vehicle? Fill out the form below and we\'ll get back to you within 24 hours.',
            contactInfo: 'Contact Information',
            phone: 'Phone',
            email: 'Email',
            address: 'Address',
            hours: 'Business Hours',
            monFri: 'Monday - Friday',
            saturday: 'Saturday',
            sunday: 'Sunday',
            closed: 'Closed',
            formTitle: 'Request a Booking',
            fullName: 'Full Name',
            emailLabel: 'Email',
            phoneLabel: 'Phone',
            service: 'Service',
            selectService: 'Select a service...',
            vehicleMake: 'Vehicle Make',
            vehicleModel: 'Vehicle Model',
            preferredDate: 'Preferred Date',
            preferredTime: 'Preferred Time',
            selectTime: 'Select a time...',
            message: 'Message',
            messagePlaceholder: 'Tell us about your vehicle and what you\'re looking for...',
            sending: 'Sending...',
            submit: 'Submit Booking Request',
        },
        serviceDetailPage: {
            backToServices: 'Back to Services',
            upTo: 'up to',
            bookThis: 'Book This Service',
        },
    },
    mk: {
        nav: {
            home: 'Дома',
            services: 'Услуги',
            portfolio: 'Портфолио',
            about: 'За нас',
            contact: 'Контакт',
            bookNow: 'Закажи',
        },
        hero: {
            badge: 'Премиум Авто Деталинг',
            title1: 'Премиум',
            title2: 'Нега за Секој',
            title3: 'Автомобил',
            subtitle: 'Детално внатрешно и надворешно чистење, полирање во 3 фази, керамичка заштита и полирање на фарови.',
            cta: 'Закажете Термин',
            ctaSecondary: 'Разгледај Услуги',
        },
        services: {
            label: 'Што Нудиме',
            title: 'Премиум',
            titleAccent: 'Услуги',
            note: 'Цените може да варираат во зависност од состојбата на возилото.',
            viewAll: 'Види Сè',
            popular: 'Популарно',
            from: 'Од',
        },
        showcase: {
            label: 'Зошто Нас',
            title1: 'Каде Опсесијата',
            title2: 'Среќава',
            titleAccent: 'Прецизност',
            features: [
                { title: 'Сертифицирани Мајстори', description: 'IDA-сертифицирани професионалци со 10,000+ часови практично искуство.' },
                { title: 'Лабораториски Производи', description: 'Користиме само Gtechniq, Gyeon и CarPro — најфините производи во индустријата.' },
                { title: '100% Гаранција за Задоволство', description: 'Не сте задоволни? Повторно го работиме бесплатно. Без прашања.' },
            ],
        },
        stats: {
            cars: 'Усовршени Возила',
            clients: 'Задоволни Клиенти',
            years: 'Години Искуство',
            rating: 'Google Оценка',
        },
        portfolio: {
            label: 'Наша Работа',
            title: 'Неодамнешни',
            titleAccent: 'Трансформации',
            viewAll: 'Целосно Портфолио',
        },
        testimonials: {
            label: 'Искуства',
            title: 'Клиентски',
            titleAccent: 'Искуства',
        },
        cta: {
            title1: 'Подготвени за',
            titleAccent: 'Разликата?',
            subtitle: 'Вашето возило заслужува повеќе од миење. Заслужува трансформација. Закажете сега и дозволете ни да ви покажеме што значи MDetailing.',
            button: 'Закажи Сега',
            buttonSecondary: 'Види Услуги',
        },
        footer: {
            tagline: 'Каде уметноста се среќава со автомобилската извонредност. Премиум деталинг услуги кои го редефинираат вашето возило.',
            navigate: 'Навигација',
            services: 'Услуги',
            getInTouch: 'Контактирајте',
            rights: 'Сите права задржани.',
            crafted: 'Изработено со прецизност.',
            ceramicCoating: 'Керамичка Заштита',
            paintCorrection: 'Корекција на Боја',
            ppf: 'Заштитна Фолија (PPF)',
            interiorExterior: 'Внатрешен и Надворешен Деталинг',
        },
        marquee: ['Керамичка Заштита', 'Корекција на Боја', 'PPF Инсталација', 'Внатрешен Деталинг', 'Надворешен Деталинг', 'Целосен Деталинг'],
        servicesPage: {
            label: 'Наши Услуги',
            title: 'Премиум Деталинг',
            titleAccent: 'Услуги',
            subtitle: 'Од основно миење до целосна керамичка заштита, нудиме широк спектар на деталинг услуги за вашето возило да изгледа совршено.',
            popular: 'ПОПУЛАРНО',
            learnMore: 'Повеќе',
            ctaTitle: 'Не сте сигурни која услуга ви треба?',
            ctaText: 'Контактирајте нè и нашиот тим ќе ви препорача совршен пакет за вашето возило.',
            ctaButton: 'Бесплатна Понуда',
        },
        portfolioPage: {
            label: 'Наша Работа',
            title: 'Портфолио',
            titleAccent: 'Галерија',
            subtitle: 'Прегледајте ги нашите неодамнешни проекти и видете ги трансформациите што ги создаваме за нашите клиенти.',
            all: 'Сите',
            noItems: 'Нема пронајдени портфолио ставки.',
            before: 'Пред',
            after: 'Потоа',
        },
        aboutPage: {
            label: 'За Нас',
            title: 'Нашата',
            titleAccent: 'Приказна',
            subtitle: 'Страствени кон перфекција од првиот ден. Дознајте што нè мотивира да испорачуваме исклучителни резултати секој пат.',
            storyTitle: 'Каде Страста Среќава',
            storyTitleAccent: 'Прецизност',
            storyP1: 'MDetailing е создаден од едноставно верување: секое возило заслужува да изгледа најдобро. Она што започна како операција на еден човек во мала гаража, прерасна во премиер деталинг сервис во регионот.',
            storyP2: 'Нашиот тим од сертифицирани професионалци користи само највисококвалитетни производи и најнови техники за трансформација на вашето возило. Без разлика дали е секојдневен автомобил или шоу кар, секое возило го третираме со исто внимание кон деталите.',
            storyP3: 'Ние не сме само за тоа автомобилите да изгледаат добро — ние сме за заштита на вашата инвестиција и да ви помогнеме повторно да се вљубите во вашето возило.',
            valuesLabel: 'Наши Вредности',
            valuesTitle: 'Што Нè Движи',
            values: [
                { title: 'Извонредност', description: 'Никогаш не правиме компромиси. Секој детал е важен и се стремиме кон перфекција во сè што правиме.' },
                { title: 'Интегритет', description: 'Чесни цени, транспарентни процеси и секогаш исполнување на ветувањата кон нашите клиенти.' },
                { title: 'Иновација', description: 'Секогаш сме чекор напред со најновите производи, техники и технологија во авто деталингот.' },
            ],
            testimonialsLabel: 'Искуства',
            testimonialsTitle: 'Клиентски Рецензии',
        },
        contactPage: {
            label: 'Контактирајте',
            title: 'Закажете',
            titleAccent: 'Термин',
            subtitle: 'Подготвени да го трансформирате вашето возило? Пополнете го формуларот подолу и ќе ви одговориме во рок од 24 часа.',
            contactInfo: 'Контакт Информации',
            phone: 'Телефон',
            email: 'Е-пошта',
            address: 'Адреса',
            hours: 'Работно Време',
            monFri: 'Понеделник - Петок',
            saturday: 'Сабота',
            sunday: 'Недела',
            closed: 'Затворено',
            formTitle: 'Побарајте Термин',
            fullName: 'Целосно Име',
            emailLabel: 'Е-пошта',
            phoneLabel: 'Телефон',
            service: 'Услуга',
            selectService: 'Изберете услуга...',
            vehicleMake: 'Марка на Возило',
            vehicleModel: 'Модел на Возило',
            preferredDate: 'Претпочитан Датум',
            preferredTime: 'Претпочитано Време',
            selectTime: 'Изберете време...',
            message: 'Порака',
            messagePlaceholder: 'Кажете ни за вашето возило и што барате...',
            sending: 'Се испраќа...',
            submit: 'Испрати Барање за Термин',
        },
        serviceDetailPage: {
            backToServices: 'Назад кон Услуги',
            upTo: 'до',
            bookThis: 'Закажи ја Оваа Услуга',
        },
    },
};

// Texts added with the redesign (merged into the ones above).
const additions = {
    en: {
        nav: { menu: 'Menu', close: 'Close menu', call: 'Call', skip: 'Skip to content', language: 'MK — Македонски' },
        hero: { scroll: 'Keep scrolling' },
        services: { details: 'Details' },
        process: {
            label: 'Our Process',
            title: 'Four steps to',
            titleAccent: 'a flawless finish',
            step1: { title: 'Inspection', description: 'We inspect the paint, interior and every surface under studio light and agree on the plan with you.' },
            step2: { title: 'Deep Clean', description: 'Hand wash, decontamination and a deep clean of the interior, wheels and every hidden corner.' },
            step3: { title: 'Correction', description: 'Machine polishing removes swirls and light scratches and brings back depth and gloss.' },
            step4: { title: 'Protection', description: 'Ceramic coating or sealant locks in the result and makes every wash easier.' },
        },
        portfolio: { open: 'View project' },
        testimonials: { prev: 'Previous review', next: 'Next review' },
        cta: { call: 'Call us' },
        footer: { hours: 'Opening Hours', directions: 'Get directions', follow: 'Follow us', home: 'Home' },
        portfolioPage: { close: 'Close', prev: 'Previous photo', next: 'Next photo', compare: 'Drag to compare' },
        contactPage: {
            vehicleYear: 'Year',
            details: 'Your details',
            vehicle: 'Vehicle',
            appointment: 'Appointment',
            required: 'Required',
            responseNote: 'We reply within 24 hours to confirm your appointment.',
            successTitle: 'Request received',
            sendAnother: 'Send another request',
            mapLoad: 'Show map',
            mapOpen: 'Open in Google Maps',
            callNow: 'Call now',
            follow: 'Follow us',
        },
        serviceDetailPage: { price: 'Price', duration: 'Duration', related: 'Other services', gallery: 'From our studio', priceNote: 'The final price depends on the size and condition of the vehicle.' },
        toast: { close: 'Close' },
    },
    mk: {
        nav: { menu: 'Мени', close: 'Затвори мени', call: 'Јави се', skip: 'Прескокни до содржината', language: 'EN — English' },
        hero: { scroll: 'Скролајте' },
        services: { details: 'Детали' },
        process: {
            label: 'Процес',
            title: 'Четири чекори до',
            titleAccent: 'совршен сјај',
            step1: { title: 'Преглед', description: 'Ја прегледуваме бојата, ентериерот и секоја површина под студиско светло и заедно го договараме планот.' },
            step2: { title: 'Длабинско чистење', description: 'Рачно миење, деконтаминација и длабинско чистење на ентериерот, тркалата и секое скриено место.' },
            step3: { title: 'Корекција', description: 'Машинското полирање ги отстранува swirl трагите и ситните гребнатини и ги враќа длабочината и сјајот.' },
            step4: { title: 'Заштита', description: 'Керамичката заштита или силантот го чуваат резултатот и го олеснуваат секое следно миење.' },
        },
        portfolio: { open: 'Погледни' },
        testimonials: { prev: 'Претходна рецензија', next: 'Следна рецензија' },
        cta: { call: 'Јавете се' },
        footer: { hours: 'Работно Време', directions: 'Насоки до нас', follow: 'Следете нè', home: 'Почетна' },
        portfolioPage: { close: 'Затвори', prev: 'Претходна фотографија', next: 'Следна фотографија', compare: 'Повлечете за споредба' },
        contactPage: {
            vehicleYear: 'Година',
            details: 'Ваши податоци',
            vehicle: 'Возило',
            appointment: 'Термин',
            required: 'Задолжително',
            responseNote: 'Ќе ви одговориме во рок од 24 часа за да го потврдиме терминот.',
            successTitle: 'Барањето е примено',
            sendAnother: 'Испрати ново барање',
            mapLoad: 'Прикажи мапа',
            mapOpen: 'Отвори во Google Maps',
            callNow: 'Јавете се сега',
            follow: 'Следете нè',
        },
        serviceDetailPage: { price: 'Цена', duration: 'Времетраење', related: 'Други услуги', gallery: 'Од нашето студио', priceNote: 'Конечната цена зависи од големината и состојбата на возилото.' },
        toast: { close: 'Затвори' },
    },
};

function merge(target, source) {
    for (const [key, value] of Object.entries(source)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && target[key] && typeof target[key] === 'object') merge(target[key], value);
        else target[key] = value;
    }
    return target;
}
merge(translations, additions);

export const LOCALES = ['mk', 'en'];

// The server's `locale` prop (from the `locale` cookie) decides the language, so server-rendered
// HTML, <html lang> and the page title all agree. This is only set in the browser, the moment
// a visitor switches language, until the reload below brings the new prop.
const client = reactive({ locale: null });

export function setLocale(locale) {
    if (!LOCALES.includes(locale) || typeof document === 'undefined') return;
    client.locale = locale;
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    try {
        localStorage.setItem('locale', locale);
    } catch {}
    document.documentElement.lang = locale;
    // Title and description in the new language.
    router.reload({ only: ['seo', 'locale'] });
}

// Visitors who picked a language before it was kept in a cookie (it used to live only in
// localStorage) keep their choice.
export function restoreSavedLocale(serverLocale) {
    let saved = null;
    try {
        saved = localStorage.getItem('locale');
    } catch {}
    if (saved && LOCALES.includes(saved) && saved !== serverLocale && !document.cookie.includes('locale=')) {
        setLocale(saved);
    }
}

function lookup(locale, key) {
    let value = translations[locale];
    for (const part of key.split('.')) {
        if (value === undefined || value === null) return undefined;
        value = value[part];
    }
    return value;
}

export function useI18n() {
    const page = usePage();
    const locale = computed(() => client.locale || page.props.locale || 'mk');

    // Interface text.
    function t(key) {
        return lookup(locale.value, key) ?? key;
    }

    // Editable text from the admin. A key left empty there stays empty (that's how the client
    // hides e.g. the e-mail); a key that isn't in the database yet falls back to t().
    function c(key, fallback = '') {
        const item = page.props.siteContent?.[key];
        if (item) return item[locale.value] || item.en || fallback;
        const value = lookup(locale.value, key);
        return typeof value === 'string' ? value : fallback;
    }

    function localized(obj, field) {
        if (!obj) return '';
        if (locale.value === 'mk' && obj[field + '_mk']) return obj[field + '_mk'];
        return obj[field] || '';
    }

    function price(amount) {
        const value = Number(amount);
        if (!value) return '';
        return `€${Number.isInteger(value) ? value : value.toFixed(2)}`;
    }

    const getLocale = () => locale.value;
    const toggleLocale = () => setLocale(locale.value === 'en' ? 'mk' : 'en');

    return { t, c, localized, price, locale, getLocale, setLocale, toggleLocale };
}

// "+389 75 657 005" → "tel:+38975657005"
export const telHref = (phone) => (phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '');
