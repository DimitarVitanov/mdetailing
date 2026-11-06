<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resized WebP copies of images uploaded in the admin (services, portfolio), so the site never
 * sends a full-size phone photo to a phone.
 *
 *   /media/{width}/{path}       e.g. /media/640/portfolio/abc.jpg.webp  from  storage/app/public/portfolio/abc.jpg
 *                                    /media/640/portfolio/abc.webp      from  storage/app/public/portfolio/abc.webp
 *
 * The first request writes the file to public/media/..., so after that the web server serves it
 * as a static file without reaching PHP. Uploads get random file names, so a replaced photo is a
 * new URL and nothing goes stale. URLs are built in resources/js/lib/img.js.
 */
class MediaController extends Controller
{
    public const WIDTHS = [320, 640, 1024, 1600];

    private const QUALITY = 72;

    public function __invoke(int $width, string $path): Response
    {
        if (! in_array($width, self::WIDTHS, true) || str_contains($path, '..')) {
            abort(404);
        }

        $source = preg_match('/\.(jpe?g|png|gif|bmp)\.webp$/i', $path) ? substr($path, 0, -5) : $path;
        $disk = Storage::disk('public');

        if (! $disk->exists($source)) {
            abort(404);
        }

        $sourcePath = $disk->path($source);
        $targets = [public_path("media/{$width}/{$path}"), storage_path("app/media/{$width}/{$path}")];

        foreach ($targets as $target) {
            if (is_file($target)) {
                return $this->send($target);
            }
        }

        $webp = $this->resize($sourcePath, $width);

        // No WebP support in this PHP build, or not an image GD can read: send the original.
        if ($webp === null) {
            return redirect('/storage/'.$source);
        }

        // public/ first (served statically from then on); storage/ when public/ isn't writable.
        foreach ($targets as $target) {
            if ((is_dir(dirname($target)) || @mkdir(dirname($target), 0755, true)) && @file_put_contents($target, $webp) !== false) {
                return $this->send($target);
            }
        }

        return response($webp, 200, $this->headers());
    }

    private function send(string $file): Response
    {
        return response()->file($file, $this->headers());
    }

    /** @return array<string, string> */
    private function headers(): array
    {
        return [
            'Content-Type' => 'image/webp',
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ];
    }

    private function resize(string $file, int $width): ?string
    {
        if (! function_exists('imagewebp')) {
            return null;
        }

        $info = @getimagesize($file);

        // Skip anything that isn't a raster image GD reads, or is too big to decode safely.
        if (! $info || $info[0] * $info[1] > 60_000_000) {
            return null;
        }

        @ini_set('memory_limit', '512M');

        $image = match ($info[2]) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($file),
            IMAGETYPE_PNG => @imagecreatefrompng($file),
            IMAGETYPE_WEBP => @imagecreatefromwebp($file),
            IMAGETYPE_GIF => @imagecreatefromgif($file),
            IMAGETYPE_BMP => @imagecreatefrombmp($file),
            default => false,
        };

        if (! $image) {
            return null;
        }

        if ($info[2] === IMAGETYPE_JPEG) {
            $image = $this->orient($image, $file);
        }

        $sourceWidth = imagesx($image);
        $sourceHeight = imagesy($image);
        $targetWidth = min($width, $sourceWidth);
        $targetHeight = max(1, (int) round($sourceHeight * $targetWidth / $sourceWidth));

        $resized = imagecreatetruecolor($targetWidth, $targetHeight);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagefill($resized, 0, 0, imagecolorallocatealpha($resized, 0, 0, 0, 127));
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight);
        imagedestroy($image);

        ob_start();
        $ok = imagewebp($resized, null, self::QUALITY);
        $bytes = ob_get_clean();
        imagedestroy($resized);

        return $ok && $bytes ? $bytes : null;
    }

    /**
     * Phones save photos sideways with an EXIF "Orientation" tag that browsers apply but GD
     * doesn't, so turn the pixels upright before resizing.
     */
    private function orient(\GdImage $image, string $file): \GdImage
    {
        if (! function_exists('exif_read_data')) {
            return $image;
        }

        $orientation = (int) (@exif_read_data($file)['Orientation'] ?? 1);

        $rotated = match ($orientation) {
            3, 4 => imagerotate($image, 180, 0),
            5, 6 => imagerotate($image, -90, 0),
            7, 8 => imagerotate($image, 90, 0),
            default => $image,
        };

        if (in_array($orientation, [2, 4, 5, 7], true)) {
            imageflip($rotated, IMG_FLIP_HORIZONTAL);
        }

        return $rotated;
    }
}
