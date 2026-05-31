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
            'value_en' => '+389 757 005',
            'value_mk' => '+389 757 005',
        ]);

        // Hide email by clearing the value
        SiteContent::where('key', 'footer.email')->update([
            'value_en' => '',
            'value_mk' => '',
        ]);

        $this->command->info('Updated phone to +389 757 005 and cleared email.');
    }
}
