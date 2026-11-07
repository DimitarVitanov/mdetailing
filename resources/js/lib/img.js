// Responsive image sources.
//   photo(name)   a site photo, pre-sized in public/img/opt as {name}-{width}.webp
//   upload(path)  an admin upload (storage path like "portfolio/abc.jpg"), resized on first
//                 request by App\Http\Controllers\MediaController and cached as a static file
// Both return { src, srcset } for <img v-bind="...">.

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

export const imageFor = (path, fallback) => (path ? upload(path) : photo(fallback));

// Site photos used when a service or portfolio item has no upload yet, picked by id so an item
// shows the same photo on every page.
const SERVICE_PHOTOS = ['audi-black-side', 'bmw-interior-03', 'audi-black-front', 'red-audi-03', 'gallery-02', 'audi-black-engine'];
const PORTFOLIO_PHOTOS = ['ferrari-rear', 'red-audi-02', 'gallery-01', 'audi-black-rear', 'gallery-03', 'red-audi-03'];
const pick = (list, id) => list[Math.abs((Number(id) || 1) - 1) % list.length];
export const servicePhoto = (service) => pick(SERVICE_PHOTOS, service?.id);
export const portfolioPhoto = (item) => pick(PORTFOLIO_PHOTOS, item?.id);

// Runs cb once the page has painted for the first time (at once on later visits), so photos below
// the first screen don't compete with the first screen's scripts, styles and fonts.
let painted = false;
const waiting = [];

function flush() {
    painted = true;
    waiting.splice(0).forEach((cb) => cb());
}

export function afterFirstPaint(cb) {
    if (painted || typeof PerformanceObserver === 'undefined' || performance.getEntriesByName('first-contentful-paint').length) {
        painted = true;
        cb();
        return;
    }
    if (!waiting.length) {
        try {
            const observer = new PerformanceObserver((list) => {
                if (list.getEntriesByName('first-contentful-paint').length) {
                    observer.disconnect();
                    flush();
                }
            });
            observer.observe({ type: 'paint' });
        } catch {
            setTimeout(flush);
        }
        setTimeout(flush, 3000);
    }
    waiting.push(cb);
}
