
const fs = require('fs');
const path = require('path');
const schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Reorder schemas
content = content.replace('schemas   = ["auth", "public"]', 'schemas   = ["public", "auth"]');

// 2. Update NotificationType enum
const oldEnum = `enum NotificationType {
  @@schema("public")
  PUSH
  EMAIL
  IN_APP
  ALL
}`;

const newEnum = `enum NotificationType {
  @@schema("public")
  PUSH
  EMAIL
  IN_APP
  ALL
  // Sync with DB
  PRAYER_RECEIVED
  PRAYER_APPROVED
  PRAYER_REJECTED
  SOMEONE_PRAYED
  PRAYER_ANSWERED
  CHURCH_EVENT
  CLAIM_STATUS
  SYSTEM
  DAILY_READING
  NEW_DOCUMENT
}`;

content = content.replace(oldEnum, newEnum);

// 3. Add ignored models for auth tables to prevent Prisma from dropping them
const authModels = `
model users {
  @@schema("auth")
  id String @id
  @@ignore
}

model identities {
  @@schema("auth")
  id String @id
  @@ignore
}

model schema_migrations {
  @@schema("auth")
  version String @id
  @@ignore
}
`;

if (!content.includes('model users {')) {
    content += authModels;
}

fs.writeFileSync(schemaPath, content);
console.log('✅ Final schema adjustments applied.');
