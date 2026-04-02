/**
 * OpenAPI / Swagger configuration for User Service.
 * Served at GET /api-docs via swagger-ui-express in server.js.
 */
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description:
        'Users: register/login, profile, full CRUD on /users (PATCH/DELETE own account requires JWT).',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'User service (direct)' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../server.js'),
  ],
};

module.exports = swaggerJsdoc(options);
