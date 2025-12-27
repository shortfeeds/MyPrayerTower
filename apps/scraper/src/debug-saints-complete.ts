
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';

async function debugSaintsComplete() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Check the main saints index page for totals
    const indexUrl = 'https://gcatholic.org/saints/index.htm';
    console.log(`Navigating to ${indexUrl}...`);
    await page.goto(indexUrl, { waitUntil: 'domcontentloaded' });

    const indexLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.filter(a => a.href.includes('/saints/')).slice(0, 20).map(a => ({
            text: a.innerText.trim(),
            href: a.href
        }));
    });
    console.log('Saints Index Links:', indexLinks);

    // Check by pontificate which might have complete list
    const byPontUrl = 'https://gcatholic.org/saints/popes/index.htm';
    console.log(`\nNavigating to ${byPontUrl}...`);
    await page.goto(byPontUrl, { waitUntil: 'domcontentloaded' });

    const pontLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.filter(a => a.href.includes('/saints/')).slice(0, 10).map(a => ({
            text: a.innerText.trim(),
            href: a.href
        }));
    });
    console.log('Pontificate Links:', pontLinks);

    // Check if there's an "all saints" page
    const allSaintsUrl = 'https://gcatholic.org/saints/data/index.htm';
    console.log(`\nNavigating to ${allSaintsUrl}...`);
    try {
        await page.goto(allSaintsUrl, { waitUntil: 'domcontentloaded' });
        const content = await page.evaluate(() => document.body.innerText.slice(0, 1000));
        console.log('Saints Data Index:', content);
    } catch (e) {
        console.log('Failed:', e.message);
    }

    await browser.close();
}

debugSaintsComplete();
