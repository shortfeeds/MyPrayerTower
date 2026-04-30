const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, 'apps', 'web', '.next', 'standalone');
const targetWebDir = path.join(standaloneDir, 'apps', 'web');

console.log('Starting post-build consolidation...');

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

  // 3. Consolidate everything into a root-level 'deploy-out' folder
  const deployOutDir = path.join(rootDir, 'deploy-out');
  
  if (fs.existsSync(deployOutDir)) {
    console.log('Cleaning existing deploy-out directory...');
    fs.rmSync(deployOutDir, { recursive: true, force: true });
  }
  
  console.log(`Consolidating final build to ${deployOutDir}...`);
  fs.mkdirSync(deployOutDir, { recursive: true });
  
  // Copy everything from standalone to deploy-out
  fs.cpSync(standaloneDir, deployOutDir, { recursive: true });

  // 4. Create root proxy files in deploy-out
  const finalServerJs = path.join(deployOutDir, 'server.js');
  const serverContent = `
console.log('Starting Root Proxy Server...');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('PORT ENV:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Log all env keys (not values for security) to verify they are present
console.log('Available Env Keys:', Object.keys(process.env).join(', '));

try {
  console.log('Attempting to require ./apps/web/server.js...');
  require('./apps/web/server.js');
  console.log('Successfully loaded ./apps/web/server.js');
} catch (err) {
  console.error('CRITICAL ERROR: Failed to load ./apps/web/server.js');
  console.error(err);
  process.exit(1);
}
`;
  fs.writeFileSync(finalServerJs, serverContent);

  const finalPackageJson = path.join(deployOutDir, 'package.json');
  const minimalPackageJson = {
    name: "myprayertower-standalone",
    version: "1.0.0",
    scripts: {
      start: "node server.js"
    }
  };
  fs.writeFileSync(finalPackageJson, JSON.stringify(minimalPackageJson, null, 2));

  // Remove the original standalone package.json if it exists in deploy-out to be safe
  const rootPackageJson = path.join(deployOutDir, 'apps', 'web', 'package.json');
  if (fs.existsSync(rootPackageJson)) {
    fs.unlinkSync(rootPackageJson);
  }

  console.log('Post-build consolidation to /deploy-out completed successfully!');
} catch (error) {
  console.error('Error during post-build copy:', error);
  process.exit(1);
}
