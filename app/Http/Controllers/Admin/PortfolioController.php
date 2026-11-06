<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Support\Slug;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Portfolio/Index', [
            'items' => PortfolioItem::with('service')->orderBy('sort_order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Portfolio/Form', [
            'services' => Service::active()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_mk' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_mk' => 'nullable|string',
            'before_image' => 'nullable|image|max:10240',
            'after_image' => 'nullable|image|max:10240',
            'category' => 'nullable|string|max:100',
            'service_id' => 'nullable|exists:services,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['slug'] = Slug::unique(PortfolioItem::class, $validated['title']);

        if ($request->hasFile('before_image')) {
            $validated['before_image'] = $request->file('before_image')->store('portfolio', 'public');
        }
        if ($request->hasFile('after_image')) {
            $validated['after_image'] = $request->file('after_image')->store('portfolio', 'public');
        }

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        PortfolioItem::create($validated);

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item created successfully.');
    }

    public function edit(PortfolioItem $portfolio)
    {
        return Inertia::render('Admin/Portfolio/Form', [
            'item' => $portfolio,
            'services' => Service::active()->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, PortfolioItem $portfolio)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_mk' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_mk' => 'nullable|string',
            'before_image' => 'nullable|image|max:10240',
            'after_image' => 'nullable|image|max:10240',
            'category' => 'nullable|string|max:100',
            'service_id' => 'nullable|exists:services,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['slug'] = Slug::unique(PortfolioItem::class, $validated['title'], $portfolio->id);

        // No new file chosen means "keep the current photo", not "remove it".
        foreach (['before_image', 'after_image'] as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store('portfolio', 'public');
            } else {
                unset($validated[$field]);
            }
        }

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $portfolio->update($validated);

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item updated successfully.');
    }

    public function destroy(PortfolioItem $portfolio)
    {
        $portfolio->delete();
        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item deleted successfully.');
    }
}
