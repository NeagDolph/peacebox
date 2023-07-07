const functions = require('firebase-functions');

let svelteSSRServer;
exports.svelteSSR = functions
  .region('us-central1')
  .https.onRequest(async (request, response) => {
    if (!svelteSSRServer) {
      functions.logger.info('Initialising SvelteKit SSR entry');
      svelteSSRServer = require('./svelteSSR/index').default;
      functions.logger.info('SvelteKit SSR entry initialised!');
    }
    functions.logger.info('Requested resource: ' + request.originalUrl);
    return svelteSSRServer(request, response);
  });
