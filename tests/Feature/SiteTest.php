<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\SiteContent;
use App\Models\User;
use Database\Seeders\RedesignContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function service(array $attributes = []): Service
    {
        return Service::create([
            'name' => 'Ceramic Coating',
            'name_mk' => 'Керамичка Заштита',
            'slug' => 'ceramic-coating',
            'short_description' => 'Long-lasting protection.',
            'description' => '<p>Details</p>',
            'price_from' => 300,
            'price_to' => 600,
            'is_active' => true,
            ...$attributes,
        ]);
    }

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_pages_print_seo_tags_in_the_first_response(): void
    {
        $service = $this->service();

        $this->get('/')
            ->assertOk()
            ->assertSee('<html lang="mk">', false)
            ->assertSee('<title data-inertia="">MDetailing — Премиум авто деталинг во Струмица</title>', false)
            ->assertSee('<meta name="description"', false)
            ->assertSee('<link rel="canonical"', false)
            ->assertSee('"@type":"AutoWash"', false);

        $this->get("/services/{$service->slug}")
            ->assertOk()
            ->assertSee('Керамичка Заштита | MDetailing', false)
            ->assertSee('"@type":"Service"', false)
            ->assertSee('"@type":"BreadcrumbList"', false);
    }

    public function test_the_language_cookie_switches_the_server_language(): void
    {
        $this->withUnencryptedCookie('locale', 'en')
            ->get('/services')
            ->assertSee('<html lang="en">', false)
            ->assertSee('Services &amp; Prices | MDetailing', false);
    }

    public function test_admin_pages_are_not_indexed(): void
    {
        $this->get('/login')->assertSee('noindex, nofollow', false);
    }

    public function test_sitemap_and_robots(): void
    {
        $this->service();
        $this->service(['name' => 'Hidden', 'slug' => 'hidden', 'is_active' => false]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml')
            ->assertSee(url('/services/ceramic-coating'))
            ->assertDontSee(url('/services/hidden'));

        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Disallow: /admin')
            ->assertSee('Sitemap: '.url('/sitemap.xml'));
    }

    public function test_an_inactive_service_page_is_not_found(): void
    {
        $this->service(['is_active' => false]);

        $this->get('/services/ceramic-coating')->assertNotFound();
    }

    public function test_a_booking_is_saved(): void
    {
        $service = $this->service();

        $this->post('/booking', [
            'client_name' => 'Ана',
            'client_email' => 'ana@example.com',
            'client_phone' => '+389 70 000 000',
            'service_id' => $service->id,
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('bookings', ['client_email' => 'ana@example.com', 'service_id' => $service->id]);
    }

    public function test_a_booking_from_a_spam_bot_is_dropped(): void
    {
        $this->post('/booking', [
            'client_name' => 'Bot',
            'client_email' => 'bot@example.com',
            'client_phone' => '000',
            'website' => 'http://spam.example',
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertSame(0, Booking::count());
    }

    public function test_booking_errors_are_in_macedonian(): void
    {
        $this->post('/booking', ['client_email' => 'nope'])
            ->assertSessionHasErrors(['client_name' => 'Ова поле е задолжително.', 'client_email' => 'Внесете валидна е-пошта.']);
    }

    public function test_saving_a_service_without_a_new_photo_keeps_the_old_one_and_its_address(): void
    {
        $service = $this->service(['image' => 'services/old.jpg']);

        $this->actingAs($this->admin())->post("/admin/services/{$service->id}", [
            'name' => 'Ceramic Coating',
            'short_description' => 'Updated',
            'description' => '<p>Updated</p>',
            'price_from' => 350,
            'image' => '',
            'sort_order' => '',
            'is_active' => '1',
        ])->assertRedirect('/admin/services');

        $service->refresh();
        $this->assertSame('services/old.jpg', $service->image);
        $this->assertSame('ceramic-coating', $service->slug);
        $this->assertSame(0, $service->sort_order);
    }

    public function test_services_with_the_same_name_get_different_addresses(): void
    {
        $this->service();

        $this->actingAs($this->admin())->post('/admin/services', [
            'name' => 'Ceramic Coating',
            'short_description' => 'Second',
            'description' => '<p>Second</p>',
            'price_from' => 100,
            'is_active' => '1',
        ])->assertRedirect('/admin/services');

        $this->assertDatabaseHas('services', ['slug' => 'ceramic-coating-2']);
    }

    public function test_saving_a_portfolio_item_keeps_its_photos_and_stores_macedonian_text(): void
    {
        $item = PortfolioItem::create(['title' => 'Audi', 'slug' => 'audi', 'before_image' => 'portfolio/b.jpg', 'after_image' => 'portfolio/a.jpg', 'is_active' => true]);

        $this->actingAs($this->admin())->post("/admin/portfolio/{$item->id}", [
            'title' => 'Audi A5',
            'title_mk' => 'Ауди А5',
            'description_mk' => 'Опис',
            'before_image' => '',
            'after_image' => '',
            'is_active' => '1',
            'is_featured' => '0',
        ])->assertRedirect('/admin/portfolio');

        $item->refresh();
        $this->assertSame(['portfolio/b.jpg', 'portfolio/a.jpg', 'Ауди А5', 'Опис'], [$item->before_image, $item->after_image, $item->title_mk, $item->description_mk]);
    }

    public function test_content_bulk_update_is_reachable(): void
    {
        $content = SiteContent::create(['key' => 'hero.badge', 'page' => 'home', 'section' => 'hero', 'value_en' => 'Old', 'value_mk' => 'Старо']);

        $this->actingAs($this->admin())->post('/admin/content/bulk-update', [
            'items' => [['id' => $content->id, 'value_en' => 'New', 'value_mk' => 'Ново']],
        ])->assertRedirect('/admin/content');

        $this->assertSame('Ново', $content->fresh()->value_mk);
    }

    public function test_the_redesign_seeder_never_changes_existing_content(): void
    {
        SiteContent::create(['key' => 'process.label', 'page' => 'home', 'section' => 'process', 'value_en' => 'Edited', 'value_mk' => 'Изменето']);

        $this->seed(RedesignContentSeeder::class);
        $this->seed(RedesignContentSeeder::class);

        $this->assertSame('Изменето', SiteContent::where('key', 'process.label')->value('value_mk'));
        $this->assertSame(1, SiteContent::where('key', 'process.label')->count());
        $this->assertTrue(SiteContent::where('key', 'seo.home.title')->exists());
    }

    public function test_uploads_are_served_as_resized_webp(): void
    {
        if (! function_exists('imagewebp')) {
            $this->markTestSkipped('GD without WebP support.');
        }

        Storage::fake('public');
        Storage::disk('public')->putFileAs('portfolio', UploadedFile::fake()->image('car.jpg', 2400, 1600), 'car.jpg');

        try {
            $response = $this->get('/media/640/portfolio/car.jpg.webp')->assertOk()->assertHeader('Content-Type', 'image/webp');
            $this->assertStringContainsString('immutable', $response->headers->get('Cache-Control'));
            $this->assertSame(640, getimagesize($response->baseResponse->getFile()->getPathname())[0]);

            $this->get('/media/641/portfolio/car.jpg.webp')->assertNotFound();
            $this->get('/media/640/portfolio/missing.jpg.webp')->assertNotFound();
        } finally {
            File::deleteDirectory(public_path('media/640/portfolio'));
        }
    }
}
