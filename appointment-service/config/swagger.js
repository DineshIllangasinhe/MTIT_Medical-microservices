/**
 * OpenAPI / Swagger configuration for Appointment Service.
 */
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3003;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Appointment Service API',
      version: '1.0.0',
      description:
        'Full CRUD for appointments (demo in-memory storage). POST /appointment or POST /appointments to create.',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Appointment service (direct)' }],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../server.js'),
  ],
};

module.exports = swaggerJsdoc(options);
