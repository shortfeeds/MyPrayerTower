
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';

async function debugPontificatePage() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const url = 'https://gcatholic.org/saints/sancti-FR1.htm';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Check what's actually on the page
    const structure = await page.evaluate(() => {
        // Check for TRs with IDs
        const trsWithId = document.querySelectorAll('tr[id]');
        console.log('TRs with ID:', trsWithId.length);

        // Check for tables
        const tables = document.querySelectorAll('table');

        // Check for any links to saints data
        const saintLinks = Array.from(document.querySelectorAll('a')).filter(a =>
            a.href.includes('/saints/data/') || a.href.includes('/saints/n/')
        );

        // Get sample content
        const bodyText = document.body.innerText.slice(0, 2000);

        // Check for name class
        const names = document.querySelectorAll('.name');

        return {
            totalTables: tables.length,
            trsWithId: trsWithId.length,
            saintLinks: saintLinks.length,
            namesClass: names.length,
            sampleLinks: saintLinks.slice(0, 10).map(a => ({ text: a.innerText, href: a.href })),
            bodySnippet: bodyText
        };
    });

    console.log('Page Structure:', JSON.stringify(structure, null, 2));

    await browser.close();
}

debugPontificatePage();
