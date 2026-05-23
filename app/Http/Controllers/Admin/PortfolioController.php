<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
            'description' => 'nullable|string',
            'before_image' => 'nullable|image|max:2048',
            'after_image' => 'nullable|image|max:2048',
            'category' => 'nullable|string|max:100',
            'service_id' => 'nullable|exists:services,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('before_image')) {
            $validated['before_image'] = $request->file('before_image')->store('portfolio', 'public');
        }
        if ($request->hasFile('after_image')) {
            $validated['after_image'] = $request->file('after_image')->store('portfolio', 'public');
        }

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
            'description' => 'nullable|string',
            'before_image' => 'nullable|image|max:2048',
            'after_image' => 'nullable|image|max:2048',
            'category' => 'nullable|string|max:100',
            'service_id' => 'nullable|exists:services,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('before_image')) {
            $validated['before_image'] = $request->file('before_image')->store('portfolio', 'public');
        }
        if ($request->hasFile('after_image')) {
            $validated['after_image'] = $request->file('after_image')->store('portfolio', 'public');
        }

        $portfolio->update($validated);

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item updated successfully.');
    }

    public function destroy(PortfolioItem $portfolio)
    {
        $portfolio->delete();
        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item deleted successfully.');
    }
}
