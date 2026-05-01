const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, 'apps', 'web', '.next', 'standalone');
const targetWebDir = path.join(standaloneDir, 'apps', 'web');

console.log('--- Final Production Deployment Preparation ---');

try {
  // 1. Copy Assets to Standalone folder (for Next.js internal use)
  const publicSrc = path.join(rootDir, 'apps', 'web', 'public');
  const staticSrc = path.join(rootDir, 'apps', 'web', '.next', 'static');

  if (fs.existsSync(publicSrc)) {
    console.log('Copying public assets to standalone...');
    fs.cpSync(publicSrc, path.join(targetWebDir, 'public'), { recursive: true });
    
    // ALSO copy to Root for Hostinger/Apache direct serving (Speeds up loading significantly)
    console.log('Copying public assets to root...');
    fs.cpSync(publicSrc, path.join(rootDir, 'public'), { recursive: true });
  }

  if (fs.existsSync(staticSrc)) {
    const nextStandaloneStatic = path.join(targetWebDir, '.next', 'static');
    if (!fs.existsSync(path.dirname(nextStandaloneStatic))) fs.mkdirSync(path.dirname(nextStandaloneStatic), { recursive: true });
    
    console.log('Copying static chunks to standalone...');
    fs.cpSync(staticSrc, nextStandaloneStatic, { recursive: true });

    // ALSO copy to Root for Hostinger/Apache direct serving
    const rootStatic = path.join(rootDir, '.next', 'static');
    if (!fs.existsSync(path.dirname(rootStatic))) fs.mkdirSync(path.dirname(rootStatic), { recursive: true });
    console.log('Copying static chunks to root...');
    fs.cpSync(staticSrc, rootStatic, { recursive: true });
  }

  // 2. Create the Root Proxy server.js using a custom server approach
  const rootServerJs = path.join(rootDir, 'server.js');
  const serverContent = `
/**
 * MY PRAYER TOWER - PRODUCTION SERVER
 * Custom Next.js Entry Point for Hostinger
 */
process.env.NODE_ENV = 'production';
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const port = process.env.PORT || 3000;
const hostname = 'localhost';

console.log('--- Starting Production Site ---');
console.log('Port:', port);

try {
  // Initialize Next.js from the apps/web directory
  const app = next({ 
    dev, 
    hostname, 
    port,
    dir: './apps/web' 
  });
  
  const handle = app.getRequestHandler();
  
  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log('> Next.js Engine Online - Ready on port ' + port);
    });
  });
} catch (err) {
  console.error('Next.js Engine: Critical Failure');
  console.error(err);
  process.exit(1);
}
`;
  
  fs.writeFileSync(rootServerJs, serverContent);
  console.log('Deployment preparation complete. Custom server script written!');

} catch (error) {
  console.error('Deployment preparation failed:', error);
  process.exit(1);
}
