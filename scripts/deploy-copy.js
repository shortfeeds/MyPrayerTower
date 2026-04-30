const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, 'apps', 'web', '.next', 'standalone');
const targetWebDir = path.join(standaloneDir, 'apps', 'web');

console.log('Starting post-build copy...');

try {
  // 1. Copy public directory
  const publicSrc = path.join(rootDir, 'apps', 'web', 'public');
  const publicDest = path.join(targetWebDir, 'public');
  
  if (fs.existsSync(publicSrc)) {
    console.log(`Copying ${publicSrc} to ${publicDest}...`);
    fs.cpSync(publicSrc, publicDest, { recursive: true });
    console.log('Public folder copied successfully.');
  } else {
    console.log('Public folder not found, skipping.');
  }

  // 2. Copy .next/static directory
  const staticSrc = path.join(rootDir, 'apps', 'web', '.next', 'static');
  const nextDest = path.join(targetWebDir, '.next');
  const staticDest = path.join(nextDest, 'static');

  if (!fs.existsSync(nextDest)) {
    fs.mkdirSync(nextDest, { recursive: true });
  }

  if (fs.existsSync(staticSrc)) {
    console.log(`Copying ${staticSrc} to ${staticDest}...`);
    fs.cpSync(staticSrc, staticDest, { recursive: true });
    console.log('Static folder copied successfully.');
  } else {
    console.log('Static folder not found, skipping.');
  }

  // 3. Overwrite package.json to prevent Hostinger from running a massive npm install loop
  // Hostinger requires a package.json, but if it has dependencies, it will try to install them.
  // Next.js standalone already has all node_modules, so we provide a fake empty package.json.
  const rootPackageJson = path.join(standaloneDir, 'package.json');
  const minimalPackageJson = {
    name: "myprayertower-standalone",
    version: "1.0.0",
    description: "Production build",
    scripts: {
      start: "node apps/web/server.js"
    }
  };

  if (fs.existsSync(rootPackageJson)) {
    console.log('Overwriting root package.json with minimal version...');
    fs.writeFileSync(rootPackageJson, JSON.stringify(minimalPackageJson, null, 2));
  }

  // We can delete the nested one safely
  const webPackageJson = path.join(targetWebDir, 'package.json');
  if (fs.existsSync(webPackageJson)) {
    console.log('Removing nested web package.json...');
    fs.unlinkSync(webPackageJson);
  }

  // 4. Create a root-level server.js to simplify Hostinger's entry point
  const rootServerJs = path.join(standaloneDir, 'server.js');
  const serverContent = `
// Proxy to the actual Next.js server
require('./apps/web/server.js');
`;

  console.log('Creating root-level server.js proxy...');
  fs.writeFileSync(rootServerJs, serverContent);

  console.log('Post-build copy completed successfully!');
} catch (error) {
  console.error('Error during post-build copy:', error);
  process.exit(1);
}
