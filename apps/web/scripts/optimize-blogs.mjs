import fs from 'fs/promises';
import path from 'path';

const blogDir = './content/blog';

// Correct App Links
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app';
const TELEGRAM_BOT_URL = 'https://t.me/MyPrayerTowerBot';

async function optimizeBlogs() {
    const files = await fs.readdir(blogDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx'));
    console.log(`Found ${mdxFiles.length} blog posts to optimize.`);

    for (const file of mdxFiles) {
        const filePath = path.join(blogDir, file);
        let content = await fs.readFile(filePath, 'utf8');

        // 1. Update in-text app links (Replacing [/] with the app store link for any "MyPrayerTower app" text)
        content = content.replace(/\[MyPrayerTower app\]\(\/\)/g, `[MyPrayerTower app](${GOOGLE_PLAY_URL})`);
        
        // 2. Fix the global TWA link if it appears anywhere
        content = content.replace(/https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.myprayertower\.twa/g, GOOGLE_PLAY_URL);

        // 3. Ensure the CTA block is 100% correct
        const ctaBlock = `
## Deepen Your Spiritual Journey

If you found this reflection helpful, we invite you to explore more ways to strengthen your faith with MyPrayerTower:

*   **[Join our Prayer Wall](/prayer-wall):** Share your intentions and pray for others in our global community.
*   **[Light a Virtual Candle](/candles):** Offer a symbolic light for your loved ones or special intentions.
*   **[Get the MyPrayerTower App](${GOOGLE_PLAY_URL}):** The full spiritual experience on your Android device.
*   **[Chat with our Telegram Bot](${TELEGRAM_BOT_URL}):** Get daily readings, saint stories, and prayer reminders directly on Telegram.

*May God bless you and keep you always in His grace.*
        `;

        if (content.includes('## Deepen Your Spiritual Journey')) {
            // Replace the whole block starting from the header to ensure it's clean
            const startIndex = content.indexOf('## Deepen Your Spiritual Journey');
            content = content.substring(0, startIndex) + ctaBlock.trim() + '\n';
        } else {
            content += ctaBlock;
        }

        await fs.writeFile(filePath, content, 'utf8');
    }

    console.log('Successfully refined all blog posts with correct links and CTAs!');
}

optimizeBlogs().catch(console.error);
