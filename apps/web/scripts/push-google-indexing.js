/**
 * Google Indexing API Automated Batch Submitter
 * 
 * Submits production URLs directly to Google's Indexing API for rapid crawling.
 * Reads credentials from:
 * 1. process.env.GOOGLE_SERVICE_ACCOUNT_JSON (raw JSON string)
 * 2. process.env.GOOGLE_APPLICATION_CREDENTIALS (file path)
 * 3. ./service-account.json or /var/www/myprayertower/service-account.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

function getServiceAccount() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        } catch (e) {
            console.error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON env var');
        }
    }

    const candidatePaths = [
        process.env.GOOGLE_APPLICATION_CREDENTIALS,
        path.join(process.cwd(), 'service-account.json'),
        path.join(process.cwd(), 'apps/web/service-account.json'),
        '/var/www/myprayertower/service-account.json'
    ].filter(Boolean);

    for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
            try {
                return JSON.parse(fs.readFileSync(p, 'utf8'));
            } catch (e) {
                console.error('Error reading service account file at', p);
            }
        }
    }

    return null;
}

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

async function getAccessToken(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/indexing',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
    const signInput = `${encodedHeader}.${encodedClaimSet}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signInput);
    const signature = sign.sign(serviceAccount.private_key, 'base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const jwt = `${signInput}.${signature}`;

    return new Promise((resolve, reject) => {
        const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
        const req = https.request({
            hostname: 'oauth2.googleapis.com',
            port: 443,
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.access_token) {
                        resolve(parsed.access_token);
                    } else {
                        reject(new Error(`Failed to get Google access token: ${data}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function notifyGoogle(url, accessToken) {
    return new Promise((resolve) => {
        const payload = JSON.stringify({
            url: url,
            type: 'URL_UPDATED'
        });

        const req = https.request({
            hostname: 'indexing.googleapis.com',
            port: 443,
            path: '/v3/urlNotifications:publish',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'Authorization': `Bearer ${accessToken}`
            }
        }, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body });
            });
        });
        req.on('error', err => resolve({ status: 500, error: err.message }));
        req.write(payload);
        req.end();
    });
}

async function run() {
    console.log('=== Starting Google Indexing API Automation ===');
    const serviceAccount = getServiceAccount();

    if (!serviceAccount) {
        console.log('\n[INFO] No Google Service Account detected.');
        console.log('To activate direct Google Indexing API push:');
        console.log('1. Go to Google Cloud Console -> Create a Service Account -> Enable Indexing API.');
        console.log('2. Add service account email as Owner in Google Search Console.');
        console.log('3. Download the JSON key and save it as "service-account.json" in this directory.');
        console.log('\nAll pages are currently actively indexed through IndexNow (Bing/Yandex/Yahoo) and WebSub.\n');
        return;
    }

    console.log(`Authenticated with Google Service Account: ${serviceAccount.client_email}`);
    const token = await getAccessToken(serviceAccount);
    console.log('Obtained Google OAuth2 Access Token successfully.');

    const urlsToPush = [
        'https://www.myprayertower.com/',
        'https://www.myprayertower.com/search',
        'https://www.myprayertower.com/prayers',
        'https://www.myprayertower.com/novenas',
        'https://www.myprayertower.com/candles',
        'https://www.myprayertower.com/saints',
        'https://www.myprayertower.com/churches',
        'https://www.myprayertower.com/rosary',
        'https://www.myprayertower.com/blog',
        'https://www.myprayertower.com/prayers/morning-offering',
        'https://www.myprayertower.com/prayers/divine-mercy-chaplet',
        'https://www.myprayertower.com/prayers/st-michael',
        'https://www.myprayertower.com/novenas/st-jude'
    ];

    console.log(`Submitting ${urlsToPush.length} primary URLs to Google Indexing API...`);
    for (const url of urlsToPush) {
        const res = await notifyGoogle(url, token);
        console.log(`  -> ${url}: HTTP ${res.status}`);
    }
    console.log('Google Indexing API submission complete!');
}

run().catch(console.error);
