const https = require('https');
const fs = require('fs');
const path = require('path');

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
    '/blog',
    '/bouquets',
    '/calendar',
    '/campaigns',
    '/candles',
    '/canon-law',
    '/careers',
    '/catechism',
    '/catholic-life',
    '/certificates',
    '/challenges',
    '/chant',
    '/chaplets',
    '/churches',
    '/claim',
    '/community',
    '/community/groups',
    '/confession',
    '/contact',
    '/contributions',
    '/cookies',
    '/dioceses',
    '/divine-office',
    '/dmca',
    '/encyclicals',
    '/events',
    '/examen',
    '/fasting',
    '/features',
    '/focus-mode',
    '/for-churches',
    '/glossary',
    '/groups',
    '/guidelines',
    '/guides',
    '/hierarchy',
    '/history',
    '/how-to',
    '/how-we-work',
    '/hymns',
    '/journal',
    '/journey',
    '/leaderboard',
    '/library',
    '/live-mass',
    '/mass-offerings',
    '/mass-times',
    '/memorials',
    '/memorials/create',
    '/news',
    '/novena-tracker',
    '/novenas',
    '/offerings',
    '/partners',
    '/pilgrimages',
    '/podcasts',
    '/prayer-partners',
    '/prayer-wall',
    '/prayers',
    '/press',
    '/privacy',
    '/quiz',
    '/reading-plans',
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
    '/watch',
    '/welcome',
    '/year-in-review',
];

// Dynamically harvest URLs across the app
function harvestAllUrls() {
    const urls = new Set(STATIC_ROUTES.map((p) => `${BASE_URL}${p}`));

    // 1. Blog posts
    const blogDir = path.join(__dirname, '..', 'content', 'blog');
    if (fs.existsSync(blogDir)) {
        try {
            const files = fs.readdirSync(blogDir);
            for (const file of files) {
                if (file.endsWith('.md') || file.endsWith('.mdx')) {
                    const slug = file.replace(/\.mdx?$/, '');
                    urls.add(`${BASE_URL}/blog/${slug}`);
                }
            }
        } catch (err) {
            console.warn('Could not read blog directory:', err.message);
        }
    }

    // 2. Guides
    const guidesDir = path.join(__dirname, '..', 'content', 'guides');
    if (fs.existsSync(guidesDir)) {
        try {
            const files = fs.readdirSync(guidesDir);
            for (const file of files) {
                if (file.endsWith('.md') || file.endsWith('.mdx')) {
                    const slug = file.replace(/\.mdx?$/, '');
                    urls.add(`${BASE_URL}/guides/${slug}`);
                }
            }
        } catch (err) {
            console.warn('Could not read guides directory:', err.message);
        }
    }

    // 3. Novenas
    const novenasFile = path.join(__dirname, '..', 'src', 'lib', 'novenas.ts');
    if (fs.existsSync(novenasFile)) {
        try {
            const text = fs.readFileSync(novenasFile, 'utf8');
            const idMatches = text.match(/id:\s*['"]([a-zA-Z0-9_-]+)['"]/g);
            if (idMatches) {
                for (const match of idMatches) {
                    const id = match.replace(/id:\s*['"]/, '').replace(/['"]/, '');
                    urls.add(`${BASE_URL}/novenas/${id}`);
                }
            }
        } catch (err) {
            console.warn('Could not read novenas.ts:', err.message);
        }
    }

    // 4. Popular Saints
    const popularSaints = [
        'st-peter',
        'st-paul',
        'st-john-the-apostle',
        'st-francis-of-assisi',
        'st-anthony-of-padua',
        'st-jude-thaddeus',
        'st-terese-of-lisieux',
        'st-padre-pio',
        'st-michael-archangel',
        'st-joseph',
        'st-benedict',
        'st-ignatius-of-loyola',
        'st-thomas-aquinas',
        'st-augustine',
        'st-patrick',
        'st-faustina-kowalska',
        'st-john-paul-ii',
        'st-mother-teresa',
        'st-rita-of-cascia',
        'st-peregrine'
    ];
    for (const saint of popularSaints) {
        urls.add(`${BASE_URL}/saints/${saint}`);
    }

    return Array.from(urls);
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
        https
            .get(urlStr, (res) => {
                resolve({ url: urlStr, status: res.statusCode, ok: res.statusCode === 200 });
            })
            .on('error', (err) => {
                resolve({ url: urlStr, status: 0, ok: false, error: err.message });
            });
    });
}

async function run() {
    console.log('🚀 Starting Universal Search Engine Indexing Submission...\n');
    console.log(`Target Host: ${HOST}`);
    console.log(`IndexNow Key: ${INDEXNOW_KEY}`);
    console.log(`Verification URL: ${BASE_URL}/${INDEXNOW_KEY}.txt\n`);

    const allUrls = harvestAllUrls();
    console.log(`📦 Successfully harvested ${allUrls.length} total URLs (Static + Blog + Guides + Novenas + Saints)\n`);

    // Submit in chunks of 500 (IndexNow accepts up to 10,000)
    const chunkSize = 500;
    for (let i = 0; i < allUrls.length; i += chunkSize) {
        const chunk = allUrls.slice(i, i + chunkSize);
        console.log(`📡 Dispatching batch ${Math.floor(i / chunkSize) + 1} (${chunk.length} URLs)...`);

        const payload = {
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: chunk,
        };

        for (const endpoint of ENDPOINTS) {
            process.stdout.write(`   -> IndexNow endpoint: ${endpoint} ... `);
            const res = await postJSON(endpoint, payload);
            if (res.ok) {
                console.log(`✅ OK (${res.status})`);
            } else {
                console.log(`⚠️ Status ${res.status}${res.error ? `: ${res.error}` : ''}`);
            }
        }
    }

    console.log('\n🌐 Pinging Global Search Engine Sitemap Gateways...');
    const sitemapEncoded = encodeURIComponent(`${BASE_URL}/sitemap.xml`);

    const googlePing = await pingUrl(`https://www.google.com/ping?sitemap=${sitemapEncoded}`);
    console.log(`   -> Google Ping: ${googlePing.ok ? '✅ OK' : '⚠️ HTTP ' + googlePing.status}`);

    const bingPing = await pingUrl(`https://www.bing.com/ping?sitemap=${sitemapEncoded}`);
    console.log(`   -> Bing/Yahoo Ping: ${bingPing.ok ? '✅ OK' : '⚠️ HTTP ' + bingPing.status}`);

    console.log('\n🎉 Universal Search Engine Indexing Submission Completed!\n');
}

run();
