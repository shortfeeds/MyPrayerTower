
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
