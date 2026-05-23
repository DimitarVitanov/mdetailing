<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PasswordController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\TestimonialController;
use Illuminate\Support\Facades\Route;

// Public Pages
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/services', [PageController::class, 'services'])->name('services');
Route::get('/services/{service:slug}', [PageController::class, 'serviceShow'])->name('services.show');
Route::get('/portfolio', [PageController::class, 'portfolio'])->name('portfolio');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/booking', [PageController::class, 'bookingStore'])->name('booking.store');

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin Panel
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('services', ServiceController::class)->except(['show']);
    Route::resource('portfolio', PortfolioController::class)->except(['show']);
    Route::resource('testimonials', TestimonialController::class)->except(['show']);

    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.update-status');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    Route::get('/content', [ContentController::class, 'index'])->name('content.index');
    Route::get('/content/{content}/edit', [ContentController::class, 'edit'])->name('content.edit');
    Route::put('/content/{content}', [ContentController::class, 'update'])->name('content.update');
    Route::post('/content/bulk-update', [ContentController::class, 'bulkUpdate'])->name('content.bulk-update');

    Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
});
