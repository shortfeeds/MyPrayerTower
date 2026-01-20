
import fs from 'fs';
import path from 'path';

const INPUT_FILE = path.join(process.cwd(), 'sitemap_local_urls.txt');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

function generateXml() {
    try {
        if (!fs.existsSync(INPUT_FILE)) {
            console.error(`Input file not found: ${INPUT_FILE}`);
            process.exit(1);
        }

        const urls = fs.readFileSync(INPUT_FILE, 'utf-8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        console.log(`Found ${urls.length} URLs. Generating XML...`);

        const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        const xmlFooter = `
</urlset>`;

        const xmlBody = urls.map(url => {
            // Basic logic: prioritize strict core pages higher, others lower
            let priority = '0.6';
            let changeFreq = 'monthly';

            if (url === 'https://myprayertower.com') { priority = '1.0'; changeFreq = 'daily'; }
            else if (url.includes('/churches/')) { priority = '0.8'; changeFreq = 'weekly'; }
            else if (url.includes('/saints/')) { priority = '0.7'; changeFreq = 'monthly'; }
            else if (url.includes('/prayers/')) { priority = '0.7'; changeFreq = 'monthly'; }

            return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }).join('\n');

        const finalXml = `${xmlHeader}\n${xmlBody}${xmlFooter}`;

        fs.writeFileSync(OUTPUT_FILE, finalXml);
        console.log(`Success! Static sitemap generated at: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error generating static sitemap:', error);
    }
}

generateXml();
