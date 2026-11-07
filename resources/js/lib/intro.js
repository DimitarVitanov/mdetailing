// The hero waits for the intro (or a page wipe) to finish before it animates in.
let ready = false;
const waiting = new Set();

export function markReady() {
    ready = true;
    for (const cb of waiting) cb();
    waiting.clear();
}

export function markBusy() {
    ready = false;
}

// Runs cb once the screen is uncovered; returns a cancel function.
export function whenReady(cb) {
    if (ready) {
        cb();
        return () => {};
    }
    waiting.add(cb);
    return () => waiting.delete(cb);
}
