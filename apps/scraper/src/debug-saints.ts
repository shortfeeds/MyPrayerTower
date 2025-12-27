
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';

async function debugSaints() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const url = 'https://gcatholic.org/saints/data/name-A.htm';

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Check specific saint link
    const search = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const aaron = links.find(a => a.innerText.includes('Aaron'));
        return aaron ? { text: aaron.innerText, href: aaron.href } : 'Not Found';
    });
    console.log('Link for Aaron:', search);

    const url2 = 'https://gcatholic.org/saints/data/saints-A.htm';
    console.log(`Navigating to ${url2}...`);
    await page.goto(url2, { waitUntil: 'domcontentloaded' });

    // Check structure of a saint entry
    const entry = await page.evaluate(() => {
        // Look for the anchor 70061 or similar structure
        // Usually entries are in divs or table rows with id
        const el = document.getElementById('70061'); // ID from Aaron link
        if (el) return { tagName: el.tagName, text: el.innerText, html: el.outerHTML.slice(0, 500) };

        // Fallback: look for any element with id
        const anyId = document.querySelector('[id]');
        return anyId ? { id: anyId.id, text: anyId.innerText } : 'No ID found';
    });
    console.log('Sample Saint Entry:', entry);

    // Check generic content for Bio
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
    console.log('Body Text Snippet:', bodyText);

    await browser.close();
}

debugSaints();
