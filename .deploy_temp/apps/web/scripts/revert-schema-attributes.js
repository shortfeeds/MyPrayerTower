const fs = require('fs');
const path = require('path');

const schemaPath = path.resolve(__dirname, '../../../packages/database/prisma/schema.prisma');

try {
    let content = fs.readFileSync(schemaPath, 'utf8');

    // Remove @@schema("public") lines (whitespace sensitive)
    // We match newline + spaces + @@schema("public")
    const newContent = content.replace(/\n\s+@@schema\("public"\)/g, '');

    fs.writeFileSync(schemaPath, newContent);
    console.log('Successfully reverted @@schema("public") attributes.');

} catch (error) {
    console.error('Error reverting schema:', error);
    process.exit(1);
}
