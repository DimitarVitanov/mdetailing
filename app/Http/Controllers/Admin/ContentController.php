<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ContentController extends Controller
{
    public function index()
    {
        $contents = SiteContent::orderBy('page')->orderBy('sort_order')->get()->groupBy('page');

        return Inertia::render('Admin/Content/Index', [
            'contents' => $contents,
        ]);
    }

    public function edit(SiteContent $content)
    {
        return Inertia::render('Admin/Content/Edit', [
            'content' => $content,
        ]);
    }

    public function update(Request $request, SiteContent $content)
    {
        $validated = $request->validate([
            'value_en' => 'nullable|string',
            'value_mk' => 'nullable|string',
        ]);

        $content->update($validated);
        Cache::forget('site_content');

        return redirect()->route('admin.content.index')->with('success', 'Content updated successfully.');
    }

    public function bulkUpdate(Request $request)
    {
        $items = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:site_contents,id',
            'items.*.value_en' => 'nullable|string',
            'items.*.value_mk' => 'nullable|string',
        ]);

        foreach ($items['items'] as $item) {
            SiteContent::where('id', $item['id'])->update([
                'value_en' => $item['value_en'],
                'value_mk' => $item['value_mk'],
            ]);
        }
        Cache::forget('site_content');

        return redirect()->route('admin.content.index')->with('success', 'All content updated successfully.');
    }
}
