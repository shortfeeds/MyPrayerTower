
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';

async function debugFullData() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Check Pope Francis saints page (942 saints)
    const francisUrl = 'https://gcatholic.org/saints/sancti-FR1.htm';
    console.log(`\n=== Pope Francis Saints (942) ===`);
    console.log(`Navigating to ${francisUrl}...`);
    await page.goto(francisUrl, { waitUntil: 'domcontentloaded' });

    const francisCount = await page.evaluate(() => {
        const rows = document.querySelectorAll('tr[id]');
        return rows.length;
    });
    console.log(`Found ${francisCount} saint entries`);

    // Check Blesseds page
    const beatiUrl = 'https://gcatholic.org/saints/beati.htm';
    console.log(`\n=== Blesseds Index ===`);
    console.log(`Navigating to ${beatiUrl}...`);
    await page.goto(beatiUrl, { waitUntil: 'domcontentloaded' });

    const beatiLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.filter(a => a.href.includes('/saints/')).slice(0, 15).map(a => ({
            text: a.innerText.trim(),
            href: a.href
        }));
    });
    console.log('Blesseds Links:', beatiLinks);

    // Check Martyrology (feast day calendar)
    const martyrUrl = 'https://gcatholic.org/saints/martyrology.htm';
    console.log(`\n=== Martyrology (Feast Days) ===`);
    console.log(`Navigating to ${martyrUrl}...`);
    await page.goto(martyrUrl, { waitUntil: 'domcontentloaded' });

    const martyrLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.filter(a => a.href.includes('/saints/')).slice(0, 15).map(a => ({
            text: a.innerText.trim(),
            href: a.href
        }));
    });
    console.log('Martyrology Links:', martyrLinks);

    // Check churches - what pages have more data?
    const churchUrl = 'https://gcatholic.org/churches/index.htm';
    console.log(`\n=== Churches Index ===`);
    console.log(`Navigating to ${churchUrl}...`);
    try {
        const response = await page.goto(churchUrl, { waitUntil: 'domcontentloaded' });
        const url = page.url();
        console.log('Landed on:', url);

        const churchLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links.filter(a => a.href.includes('/churches/')).slice(0, 15).map(a => ({
                text: a.innerText.trim(),
                href: a.href
            }));
        });
        console.log('Churches Links:', churchLinks);
    } catch (e) {
        console.log('Failed:', e.message);
    }

    await browser.close();
}

debugFullData();
