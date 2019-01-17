'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');

const express = require('express');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');

const log = require('./log').logger;
const initIndy = require('./service/IndyService').init;

// Initialize Government with API Indy Node
setTimeout(() => {
    initIndy()
        .then(() => log.info('Completed registration successfully'))
        .catch(e => {
            log.error('Something went wrong while starting up');
            log.error(e);
            process.exit(1);
        });
}, process.env.GOV_START_UP_INTERVAL || 5000);

const app = express();
const serverPort = process.env.GOV_PORT || 8090;

// swaggerRouter configuration
const options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    app.use(express.static(path.join(__dirname, 'public')));

    // Start the server
    http.createServer(app).listen(serverPort, () => {
        log.info(`Your server is listening on port ${serverPort} (http://${process.env.GOV_HOST}:${serverPort})`);
        log.info(`Swagger-ui is available on http://${process.env.GOV_HOST}:${serverPort}/docs`);
    });
});
