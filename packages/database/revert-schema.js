
const fs = require('fs');
const path = require('path');
const schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Remove previewFeatures = ["multiSchema"]
content = content.replace('previewFeatures = ["multiSchema"]', '');

// 2. Revert datasource
content = content.replace(/schemas\s*=\s*\["public", "auth"\]/, '');

// 3. Remove @@schema attributes
content = content.replace(/\n\s*@@schema\("[^"]+"\)/g, '');

// also remove the dummy models if added at the end
content = content.split('model users {')[0];

fs.writeFileSync(schemaPath, content);
console.log('✅ Reverted schema.prisma to single-schema.');
