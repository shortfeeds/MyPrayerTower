const fs = require('fs');
const path = require('path');

const schemaPath = path.resolve(__dirname, '../../../packages/database/prisma/schema.prisma');

try {
    let content = fs.readFileSync(schemaPath, 'utf8');

    // Regex to find models and enums and inject @@schema("public")
    // Matches "model Name {" or "enum Name {"
    // Replaces with "model Name {\n  @@schema("public")"

    // We modify the regex to ensure we don't add it if it's already there (though unlikely given the error count)
    // But simplest is just to add it after the opening brace.

    const newContent = content.replace(
        /((?:model|enum)\s+\w+\s+\{)/g,
        '$1\n  @@schema("public")'
    );

    // Also need to handle the datasource block which we already updated manually, 
    // but the previous step might have been overwritten if I'm not careful? 
    // No, I'm reading the current file.

    fs.writeFileSync(schemaPath, newContent);
    console.log('Successfully updated schema.prisma with @@schema("public") attributes.');

} catch (error) {
    console.error('Error fixing schema:', error);
    process.exit(1);
}
