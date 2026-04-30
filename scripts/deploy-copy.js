const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, 'apps', 'web', '.next', 'standalone');
const targetWebDir = path.join(standaloneDir, 'apps', 'web');

console.log('Starting Root-Level Deployment Preparation...');

try {
  // 1. Copy public directory into standalone
  const publicSrc = path.join(rootDir, 'apps', 'web', 'public');
  const publicDest = path.join(targetWebDir, 'public');
  
  if (fs.existsSync(publicSrc)) {
    console.log(`Copying ${publicSrc} to ${publicDest}...`);
    fs.cpSync(publicSrc, publicDest, { recursive: true });
  }

  // 2. Copy .next/static directory into standalone
  const staticSrc = path.join(rootDir, 'apps', 'web', '.next', 'static');
  const nextDest = path.join(targetWebDir, '.next');
  const staticDest = path.join(nextDest, 'static');

  if (!fs.existsSync(nextDest)) {
    fs.mkdirSync(nextDest, { recursive: true });
  }

  if (fs.existsSync(staticSrc)) {
    console.log(`Copying ${staticSrc} to ${staticDest}...`);
    fs.cpSync(staticSrc, staticDest, { recursive: true });
  }

  // 3. Create a ROOT-LEVEL server.js proxy
  // This allows Hostinger to use "." as Output Directory and "server.js" as Entry Point
  const rootServerJs = path.join(rootDir, 'server.js');
  const serverContent = `
/**
 * HOSTINGER ROOT PROXY
 * This file is created during build to point Hostinger to the standalone Next.js server.
 */
console.log('--- Starting Hostinger Root Proxy ---');
console.log('CWD:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

try {
  const standaloneServer = './apps/web/.next/standalone/apps/web/server.js';
  console.log('Loading standalone server from:', standaloneServer);
  require(standaloneServer);
  console.log('Standalone server loaded successfully.');
} catch (err) {
  console.error('CRITICAL ERROR: Failed to load standalone server!');
  console.error(err);
  process.exit(1);
}
`;
  
  console.log('Creating/Updating root-level server.js...');
  fs.writeFileSync(rootServerJs, serverContent);

  console.log('Root-level preparation completed successfully!');
} catch (error) {
  console.error('Error during deployment preparation:', error);
  process.exit(1);
}
