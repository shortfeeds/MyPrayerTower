
const fs = require('fs');
const path = require('path');
const schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
let lines = fs.readFileSync(schemaPath, 'utf8').split('\n');

let updated = 0;
for (let i = 1; i < lines.length; i++) {
    // If we find @@schema("public") but the line above is a comment or blank, 
    // it's likely a mistake from the previous regex.
    if (lines[i].includes('@@schema("public")')) {
        let prevLine = lines[i - 1].trim();
        if (prevLine.startsWith('//')) {
            lines[i] = '// ' + lines[i].trim();
            updated++;
        }
    }
}

fs.writeFileSync(schemaPath, lines.join('\n'));
console.log(`✅ Fixed ${updated} misplaced @@schema attributes.`);
