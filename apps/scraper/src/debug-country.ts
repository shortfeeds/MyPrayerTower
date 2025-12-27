
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';

async function debugCountry() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const url = 'https://gcatholic.org/dioceses/country/FR.htm';

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Log title
    const title = await page.title();
    console.log(`Page Title: ${title}`);

    // Log h1
    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log(`H1: ${h1}`);

    // Log all links
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).slice(0, 20).map(a => ({
            text: a.textContent?.trim(),
            href: a.href
        }));
    });
    console.log('Sample Links:', links);

    // Check specific diocese links
    const dioceseLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('/dioceses/diocese/')).map(a => a.href);
    });
    console.log('Diocese Links Found:', dioceseLinks.length);
    if (dioceseLinks.length > 0) console.log('Sample Diocese:', dioceseLinks[0]);

    await browser.close();
}

debugCountry();
