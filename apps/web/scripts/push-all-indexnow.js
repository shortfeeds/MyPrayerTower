const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function postIndexNow(endpoint, host, key, urls) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: host,
      key: key,
      keyLocation: 'https://' + host + '/' + key + '.txt',
      urlList: urls
    });
    const u = new URL(endpoint);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'MyPrayerTower-SuperIndex/1.0'
      }
    }, res => {
      let responseBody = '';
      res.on('data', d => responseBody += d);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: responseBody });
      });
    });
    req.on('error', err => resolve({ status: 500, error: err.message }));
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Fetching all production sitemaps...');
  const main = await fetchText('https://www.myprayertower.com/sitemap-main.xml');
  const blog = await fetchText('https://www.myprayertower.com/sitemap-blog.xml');
  const saints = await fetchText('https://www.myprayertower.com/sitemap-saints.xml');
  const prayers = await fetchText('https://www.myprayertower.com/sitemap-prayers.xml');
  const guides = await fetchText('https://www.myprayertower.com/sitemap-guides.xml');

  const extractUrls = (xml) => {
    const matches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
    return matches.map(m => m.replace(/<\/?loc>/g, '').trim());
  };

  const allUrls = Array.from(new Set([
    ...extractUrls(main),
    ...extractUrls(blog),
    ...extractUrls(saints),
    ...extractUrls(prayers),
    ...extractUrls(guides)
  ]));

  console.log('Total extracted unique URLs:', allUrls.length);

  const HOST = 'www.myprayertower.com';
  const KEY = '565731002ad842e8bf184087dab6dc41';

  // Split into batches of 3000 to be safe
  const chunkSize = 3000;
  for (let i = 0; i < allUrls.length; i += chunkSize) {
    const chunk = allUrls.slice(i, i + chunkSize);
    const batchNum = Math.floor(i / chunkSize) + 1;
    console.log(`Dispatching batch ${batchNum} with ${chunk.length} URLs...`);
    
    const resOrg = await postIndexNow('https://api.indexnow.org/indexnow', HOST, KEY, chunk);
    console.log(`  -> api.indexnow.org status: ${resOrg.status} ${resOrg.body || 'OK'}`);

    const resBing = await postIndexNow('https://www.bing.com/indexnow', HOST, KEY, chunk);
    console.log(`  -> bing.com/indexnow status: ${resBing.status} ${resBing.body || 'OK'}`);
  }

  console.log('All batches pushed successfully to IndexNow & Bing!');

  // Ping Google WebSub Hub
  console.log('Pinging Google WebSub Hub (pubsubhubbub.appspot.com)...');
  await new Promise(resolve => {
    const postData = 'hub.mode=publish&hub.url=' + encodeURIComponent('https://www.myprayertower.com/feed.xml');
    const req = https.request({
      hostname: 'pubsubhubbub.appspot.com',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      console.log('  -> Google WebSub Hub status:', res.statusCode);
      resolve();
    });
    req.on('error', () => resolve());
    req.write(postData);
    req.end();
  });
}

run().catch(console.error);
