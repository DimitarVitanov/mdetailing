// Responsive image sources, used as <img v-bind="photo('hero-studio')" sizes="...">.
//
// photo(name)   one of the site's own photos, pre-sized in public/img/opt as {name}-{width}.webp
// upload(path)  an image uploaded in the admin (storage path like "portfolio/abc.jpg"), resized on
//               first request by App\Http\Controllers\MediaController and cached as a static file

export const WIDTHS = [640, 1024, 1600];

const set = (url) => WIDTHS.map((w) => `${url(w)} ${w}w`).join(', ');

export function photo(name) {
    const url = (w) => `/img/opt/${name}-${w}.webp`;
    return { src: url(1024), srcset: set(url) };
}

export function upload(path) {
    const file = /\.webp$/i.test(path) ? path : `${path}.webp`;
    const url = (w) => `/media/${w}/${file}`;
    return { src: url(1024), srcset: set(url) };
}

// An uploaded image when there is one, otherwise one of the site photos.
export const imageFor = (path, fallback) => (path ? upload(path) : photo(fallback));

// Site photos used when a service or portfolio item has no upload yet. Picked by id, so an item
// shows the same photo on every page.
const SERVICE_PHOTOS = ['audi-black-side', 'audi-black-engine', 'bmw-interior-steering', 'red-audi-front', 'audi-black-front-2', 'bmw-interior-04'];
const PORTFOLIO_PHOTOS = ['ferrari-rear', 'red-audi-02', 'gallery-01', 'audi-black-rear', 'gallery-03', 'red-audi-03'];

const pick = (list, id) => list[Math.abs((Number(id) || 1) - 1) % list.length];
export const servicePhoto = (service) => pick(SERVICE_PHOTOS, service?.id);
export const portfolioPhoto = (item) => pick(PORTFOLIO_PHOTOS, item?.id);
