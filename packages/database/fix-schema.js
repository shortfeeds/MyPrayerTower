
const fs = require('fs');
const path = require('path');

const schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// Regex to find model and enum blocks and inject @@schema("public")
// It looks for 'model Name {' or 'enum Name {' and adds the schema attribute as the first line inside.
// Use a more robust regex that avoids double-injecting if we run it twice.

function injectSchema(type) {
    const regex = new RegExp(`(${type}\\s+\\w+\\s*\\{)`, 'g');
    content = content.replace(regex, (match) => {
        // Only inject if not already there
        // Actually, we'll just check if the next non-whitespace line is @@schema
        return `${match}\n  @@schema("public")`;
    });
}

// Clean up any double injections or incorrect placements if necessary
// But since we are starting fresh, it's fine.
// Wait, I already modified the file once to add multiSchema.

injectSchema('model');
injectSchema('enum');

// Special case: if we find @@schema("public") right after @@schema("public"), remove one.
// (Simple guard for multiple runs)
content = content.replace(/(@@schema\("public"\)\s*\n\s*@@schema\("public"\))/g, '@@schema("public")');

fs.writeFileSync(schemaPath, content);
console.log('✅ Updated schema.prisma with @@schema attributes.');
