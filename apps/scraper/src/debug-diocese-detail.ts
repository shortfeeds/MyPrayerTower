
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';

async function debugDiocese() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const url = 'https://gcatholic.org/dioceses/diocese/agen0.htm'; // Diocese of Agen

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Look for churches
    const content = await page.evaluate(() => {
        // Look for headings like "Churches" or "Special Churches"
        const headings = Array.from(document.querySelectorAll('h3, h4, th')).map(h => ({ tag: h.tagName, text: h.innerText }));

        // Look for links containing "churches" or specific types
        const links = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('/churches/'));

        // Find "Principal Churches" list items usually
        // Or table rows

        return { headings, links: links.slice(0, 10).map(l => ({ text: l.innerText, href: l.href })) };
    });

    console.log('Content:', content);
    await browser.close();
}

debugDiocese();
