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

  console.log('Post-build copy completed successfully!');
} catch (error) {
  console.error('Error during post-build copy:', error);
  process.exit(1);
}
