<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class UpdateContactInfoSeeder extends Seeder
{
    public function run(): void
    {
        // Update phone number
        SiteContent::where('key', 'footer.phone')->update([
            'value_en' => '+389 75 657 005',
            'value_mk' => '+389 75 657 005',
        ]);

        // Hide email by clearing the value
        SiteContent::where('key', 'footer.email')->update([
            'value_en' => '',
            'value_mk' => '',
        ]);

        // Update address
        SiteContent::where('key', 'footer.address')->update([
            'value_en' => 'Strumica, North Macedonia',
            'value_mk' => 'Струмица, Северна Македонија',
        ]);

        // Fix contact page title
        SiteContent::where('key', 'contactPage.title')->update([
            'value_mk' => 'Закажете',
        ]);

        SiteContent::where('key', 'contactPage.titleAccent')->update([
            'value_mk' => 'Термин',
        ]);

        $this->command->info('Updated phone, cleared email, fixed contact page title.');
    }
}
