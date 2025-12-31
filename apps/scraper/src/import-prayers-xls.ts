/**
 * Prayer Import Script from Excel (XLS/XLSX)
 * Imports prayers from an Excel file into the database
 * 
 * Expected columns: "Prayer Name", "Prayer Content", "Final Category" (or sheet name as fallback)
 */

import { PrismaClient } from '@mpt/database';
import * as XLSX from 'xlsx';
import { randomUUID } from 'crypto';
import * as path from 'path';

const prisma = new PrismaClient();

// Generate a cuid-like ID
function generateId(): string {
    return randomUUID().replace(/-/g, '').slice(0, 25);
}

// Generate a URL-friendly slug from a title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
}

// Path to the Excel file
const EXCEL_FILE_PATH = process.argv[2] || path.join(__dirname, '../../Prayers.xlsx');

interface PrayerRow {
    'Prayer Name'?: string;
    'Prayer Content'?: string;
    'Final Category'?: string;
    'Final Category Code'?: string;
    'Search Tags'?: string;
    Title?: string;
    title?: string;
    Content?: string;
    content?: string;
    Category?: string;
    category?: string;
    Slug?: string;
    slug?: string;
    Language?: string;
    language?: string;
    Author?: string;
    author?: string;
    Source?: string;
    source?: string;
    [key: string]: any;
}

async function main() {
    console.log('🙏 Starting prayer import from Excel file...');
    console.log(`📁 Reading file: ${EXCEL_FILE_PATH}\n`);

    // Read the Excel file
    let workbook: XLSX.WorkBook;
    try {
        workbook = XLSX.readFile(EXCEL_FILE_PATH);
    } catch (error) {
        console.error('❌ Error reading Excel file:', error);
        process.exit(1);
    }

    // Get sheet names
    console.log(`📋 Found sheets: ${workbook.SheetNames.join(', ')}\n`);

    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Cache for categories
    const categoryCache: Map<string, string> = new Map();

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
        console.log(`\n📖 Processing sheet: ${sheetName}`);

        const sheet = workbook.Sheets[sheetName];
        const rows: PrayerRow[] = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            console.log('   ⚠️ Sheet is empty, skipping...');
            continue;
        }

        // Show column headers found
        const headers = Object.keys(rows[0]);
        console.log(`   Columns found: ${headers.join(', ')}`);
        console.log(`   Total rows: ${rows.length}`);

        // Process each row
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            // Get values - support multiple column name formats
            const title = row['Prayer Name'] || row.Title || row.title || row.Name || row.name;
            const content = row['Prayer Content'] || row.Content || row.content || row.Text || row.text || row.Prayer || row.prayer;
            const categoryName = row['Final Category'] || row.Category || row.category || sheetName;
            const language = row.Language || row.language || 'en';
            const author = row.Author || row.author;
            const source = row.Source || row.source || 'Excel Import';
            let slug = row.Slug || row.slug;

            // Validate required fields
            if (!title) {
                // Don't spam logs, just count
                totalSkipped++;
                continue;
            }

            if (!content) {
                console.log(`   ⚠️ Row ${i + 2}: Missing content for "${title}", skipping...`);
                totalSkipped++;
                continue;
            }

            // Generate slug if not provided
            if (!slug) {
                slug = generateSlug(String(title));
            }

            // Ensure unique slug by appending number if needed
            let uniqueSlug = slug;
            let slugCounter = 0;
            while (true) {
                const existing = await prisma.prayer.findUnique({ where: { slug: uniqueSlug } });
                if (!existing) break;
                slugCounter++;
                uniqueSlug = `${slug}-${slugCounter}`;
            }
            slug = uniqueSlug;

            // Get or create category
            let categoryId = categoryCache.get(categoryName);
            if (!categoryId) {
                const catSlug = generateSlug(categoryName);
                let cat = await prisma.prayerLibraryCategory.findUnique({ where: { slug: catSlug } });
                if (!cat) {
                    cat = await prisma.prayerLibraryCategory.create({
                        data: {
                            id: generateId(),
                            name: categoryName,
                            slug: catSlug,
                            updatedAt: new Date()
                        }
                    });
                    console.log(`   ✅ Created category: ${categoryName}`);
                }
                categoryId = cat.id;
                categoryCache.set(categoryName, categoryId);
            }

            // Create the prayer
            try {
                await prisma.prayer.create({
                    data: {
                        id: generateId(),
                        title: String(title).trim(),
                        slug,
                        content: String(content).trim(),
                        categoryId: categoryId,
                        language,
                        author: author ? String(author).trim() : null,
                        source: source ? String(source).trim() : 'Excel Import',
                        isPublished: true,
                        updatedAt: new Date()
                    }
                });
                process.stdout.write('✓');
                totalImported++;
            } catch (error: any) {
                process.stdout.write('x');
                totalErrors++;
                console.log(`\n   ❌ Error importing "${title}": ${error.message}`);
            }
        }
        console.log(''); // New line after progress dots
    }

    console.log(`\n✅ Import Complete!`);
    console.log(`   Imported: ${totalImported}`);
    console.log(`   Skipped (empty/missing): ${totalSkipped}`);
    console.log(`   Errors: ${totalErrors}`);

    const totalPrayers = await prisma.prayer.count();
    const totalCategories = await prisma.prayerLibraryCategory.count();
    console.log(`\n📊 Database Summary:`);
    console.log(`   Total prayers: ${totalPrayers}`);
    console.log(`   Total categories: ${totalCategories}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
