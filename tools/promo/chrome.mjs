// Starts a headless Chrome the plain way (its own process, output discarded) and connects to it.
// Chrome launched through puppeteer.launch stalls for seconds at a time while a video is loaded,
// which spoils captures of the hero; a separately started one doesn't.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function startChrome({ port = 9341, gpu = false } = {}) {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-chrome-'));
    const args = ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'];
    if (gpu) args.push('--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist');
    const child = spawn(CHROME, [...args, 'about:blank'], { stdio: 'ignore' });
    const url = `http://127.0.0.1:${port}`;
    for (let i = 0; i < 100; i++) {
        try {
            await fetch(`${url}/json/version`);
            break;
        } catch {
            await new Promise((r) => setTimeout(r, 100));
        }
    }
    const browser = await puppeteer.connect({ browserURL: url, defaultViewport: null });
    return {
        browser,
        async close() {
            const exited = new Promise((r) => child.once('exit', r));
            await browser.close().catch(() => {});
            child.kill();
            await exited;
            fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
        },
    };
}
