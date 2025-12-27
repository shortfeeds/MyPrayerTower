import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const URL = 'https://www.netministries.org/churches';

async function main() {
    try {
        console.log(`Fetching ${URL}...`);
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        // Log all links to see if we can spot pagination
        const links: string[] = [];
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            links.push(`[${text}](${href})`);
        });

        fs.writeFileSync('probe_output.txt', links.join('\n'));
        console.log('Links saved to probe_output.txt');

        // Check for specific pagination classes often used
        const pagination = $('.pagination, .pages, .pager').html();
        if (pagination) {
            console.log('Found pagination container:', pagination);
        }

    } catch (error) {
        console.error(error);
    }
}

main();
