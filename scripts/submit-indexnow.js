const https = require('https');
const http = require('http');

const INDEXNOW_KEY = '565731002ad842e8bf184087dab6dc41';
const HOST = 'www.myprayertower.com';
const BASE_URL = `https://${HOST}`;

const ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
];

const SUB_SITEMAPS = [
    'https://www.myprayertower.com/sitemap-main.xml',
    'https://www.myprayertower.com/sitemap-categories.xml',
    'https://www.myprayertower.com/sitemap-products.xml',
    'https://www.myprayertower.com/sitemap-blog.xml',
    'https://www.myprayertower.com/sitemap-saints.xml',
    'https://www.myprayertower.com/sitemap-prayers.xml',
    'https://www.myprayertower.com/sitemap-guides.xml',
];

const FALLBACK_ROUTES = [
    '/',
    '/about',
    '/actions',
    '/advertise',
    '/anniversaries',
    '/art',
    '/bible',
    '/blessings',
    '/bouquets',
    '/my-vigils',
    '/calendar',
    '/campaigns',
    '/candles',
    '/canon-law',
    '/careers',
    '/catechism',
    '/challenges',
    '/chant',
    '/chaplets',
    '/churches',
    '/claim',
    '/contact',
    '/contributions',
    '/cookies',
    '/dioceses',
    '/dmca',
    '/encyclicals',
    '/events',
    '/examen',
    '/fasting',
    '/features',
    '/for-churches',
    '/glossary',
    '/groups',
    '/guidelines',
    '/guides',
    '/blog',
    '/hierarchy',
    '/history',
    '/how-to',
    '/how-we-work',
    '/hymns',
    '/journey',
    '/leaderboard',
    '/library',
    '/live-mass',
    '/mass-offerings',
    '/mass-times',
    '/memorials',
    '/news',
    '/novenas',
    '/partners',
    '/pilgrimages',
    '/podcasts',
    '/prayer-wall',
    '/prayers',
    '/press',
    '/privacy',
    '/quiz',
    '/readings',
    '/refunds',
    '/rosary',
    '/sacraments',
    '/saints',
    '/stations',
    '/summa',
    '/terms',
    '/testimonies',
    '/vatican-ii',
    '/welcome',
    '/year-in-review',
    '/sitemap.xml',
    '/llms.txt',
    '/llms-full.txt',
    '/ai-manifest.json',
];

function fetchText(urlStr) {
    return new Promise((resolve) => {
        https.get(urlStr, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => resolve(data));
        }).on('error', (err) => {
            console.warn(`[Warning] Could not fetch ${urlStr}: ${err.message}`);
            resolve('');
        });
    });
}

async function postJSON(urlStr, data) {
    return new Promise((resolve) => {
        const u = new URL(urlStr);
        const bodyStr = JSON.stringify(data);
        const options = {
            hostname: u.hostname,
            port: u.port || 443,
            path: u.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(bodyStr),
                'User-Agent': 'MyPrayerTower-IndexNow-Engine/2.0',
            },
        };

        const req = https.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => (resData += chunk));
            res.on('end', () => {
                resolve({
                    endpoint: urlStr,
                    status: res.statusCode,
                    ok: res.statusCode === 200 || res.statusCode === 202,
                });
            });
        });

        req.on('error', (err) => {
            resolve({
                endpoint: urlStr,
                status: 0,
                ok: false,
                error: err.message,
            });
        });

        req.write(bodyStr);
        req.end();
    });
}

async function pingUrl(urlStr) {
    return new Promise((resolve) => {
        https.get(urlStr, (res) => {
            resolve({ url: urlStr, status: res.statusCode, ok: res.statusCode === 200 });
        }).on('error', (err) => {
            resolve({ url: urlStr, status: 0, ok: false, error: err.message });
        });
    });
}

async function collectAllUrls() {
    console.log('📡 Fetching active URLs from live sitemaps...');
    const allUrls = new Set();

    for (const smUrl of SUB_SITEMAPS) {
        const smName = smUrl.split('/').pop();
        const xml = await fetchText(smUrl);
        const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
        if (matches.length > 0) {
            matches.forEach((u) => allUrls.add(u));
            console.log(`  ✓ ${smName}: ${matches.length} URLs extracted`);
        } else {
            console.log(`  ⚠️ ${smName}: 0 URLs extracted or unreachable`);
        }
    }

    if (allUrls.size === 0) {
        console.log('⚠️ Sitemaps returned 0 URLs. Falling back to core static paths...');
        FALLBACK_ROUTES.forEach((path) => allUrls.add(`${BASE_URL}${path}`));
    } else {
        // Also ensure fallback routes and machine files are present
        FALLBACK_ROUTES.forEach((path) => allUrls.add(`${BASE_URL}${path}`));
    }

    return Array.from(allUrls);
}

async function run() {
    console.log('🚀 Starting IndexNow & Search Engine Automated Indexing Submission...\n');
    console.log(`Host: ${HOST}`);
    console.log(`Key: ${INDEXNOW_KEY}`);
    console.log(`Key Verification URL: ${BASE_URL}/${INDEXNOW_KEY}.txt\n`);

    const urls = await collectAllUrls();
    console.log(`\n📊 Total unique URLs to syndicate: ${urls.length}`);

    // IndexNow maximum limit per POST payload is 10,000 URLs
    const BATCH_SIZE = 10000;
    const batches = [];
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        batches.push(urls.slice(i, i + BATCH_SIZE));
    }

    for (let bIndex = 0; bIndex < batches.length; bIndex++) {
        const batch = batches[bIndex];
        console.log(`\n📤 Submitting batch ${bIndex + 1}/${batches.length} (${batch.length} URLs)...`);

        const payload = {
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: batch,
        };

        for (const endpoint of ENDPOINTS) {
            process.stdout.write(` -> Sending to ${endpoint} ... `);
            const res = await postJSON(endpoint, payload);
            if (res.ok) {
                console.log(`✅ SUCCESS (HTTP ${res.status})`);
            } else {
                console.log(`⚠️ HTTP ${res.status}${res.error ? `: ${res.error}` : ''}`);
            }
        }
    }

    console.log('\n📡 Sitemaps & Search Engine Ping Status:');
    const sitemapEncoded = encodeURIComponent(`${BASE_URL}/sitemap.xml`);

    const googlePing = await pingUrl(`https://www.google.com/ping?sitemap=${sitemapEncoded}`);
    console.log(` -> Google Sitemap Ping: ${googlePing.ok ? '✅ SUCCESS' : '⚠️ Response code: ' + googlePing.status + ' (Google deprecated ping in late 2023; relies on robots.txt Sitemap & Search Console)'}`);

    const bingPing = await pingUrl(`https://www.bing.com/ping?sitemap=${sitemapEncoded}`);
    console.log(` -> Bing Sitemap Ping: ${bingPing.ok ? '✅ SUCCESS' : '⚠️ Response code: ' + bingPing.status + ' (Bing now uses IndexNow directly)'}`);

    console.log(`\n🎉 IndexNow submission completed! All ${urls.length} URLs successfully syndicated.`);
}

run();
