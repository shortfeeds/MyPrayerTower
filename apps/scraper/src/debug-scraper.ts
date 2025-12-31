
import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function debug() {
    const url = 'https://myprayertower.com/category/basic-prayers/';
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    const html = await res.text();
    console.log(`HTML length: ${html.length}`);

    // Save HTML to check manually if needed (optional, but good for local dev)
    // fs.writeFileSync('debug_page.html', html);

    const $ = cheerio.load(html);
    const links: string[] = [];
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href) links.push(href);
    });

    console.log(`Found ${links.length} links.`);
    const prayerLinks = links.filter(l => l.includes('/prayers/'));
    console.log(`Found ${prayerLinks.length} links containing '/prayers/'`);
    console.log('Sample prayer links:', prayerLinks.slice(0, 5));
}

debug();
