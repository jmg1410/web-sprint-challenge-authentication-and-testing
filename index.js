const server = require('./api/server.js');

const PORT = process.env.PORT || 9000;
if (process.env.NODE_ENV !== 'testing') {
  server.listen(PORT, () => {
    console.log(`\n=== Server listening on port ${PORT} ===\n`);
  });
}