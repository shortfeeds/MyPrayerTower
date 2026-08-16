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

const STATIC_ROUTES = [
    '/',
    '/about',
    '/actions',
    '/advertise',
    '/anniversaries',
    '/art',
    '/bible',
    '/bouquets',
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
];

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
                'User-Agent': 'MyPrayerTower-IndexNow-CLI/1.0',
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

async function run() {
    console.log('🚀 Starting IndexNow & Search Engine Quick Indexing Submission...\n');
    console.log(`Host: ${HOST}`);
    console.log(`Key: ${INDEXNOW_KEY}`);
    console.log(`Key Verification URL: ${BASE_URL}/${INDEXNOW_KEY}.txt\n`);

    const fullUrls = STATIC_ROUTES.map((path) => `${BASE_URL}${path}`);
    console.log(`Submitting ${fullUrls.length} core URLs to IndexNow endpoints...`);

    const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls,
    };

    for (const endpoint of ENDPOINTS) {
        process.stdout.write(` -> Sending to ${endpoint} ... `);
        const res = await postJSON(endpoint, payload);
        if (res.ok) {
            console.log(`✅ SUCCESS (HTTP ${res.status})`);
        } else {
            console.log(`⚠️ FAILED (HTTP ${res.status}${res.error ? `: ${res.error}` : ''})`);
        }
    }

    console.log('\n📡 Pinging Search Engine Sitemap Endpoints...');
    const sitemapEncoded = encodeURIComponent(`${BASE_URL}/sitemap.xml`);

    const googlePing = await pingUrl(`https://www.google.com/ping?sitemap=${sitemapEncoded}`);
    console.log(` -> Google Sitemap Ping: ${googlePing.ok ? '✅ SUCCESS' : '⚠️ Response code: ' + googlePing.status}`);

    const bingPing = await pingUrl(`https://www.bing.com/ping?sitemap=${sitemapEncoded}`);
    console.log(` -> Bing Sitemap Ping: ${bingPing.ok ? '✅ SUCCESS' : '⚠️ Response code: ' + bingPing.status}`);

    console.log('\n🎉 IndexNow submission completed successfully!');
}

run();
