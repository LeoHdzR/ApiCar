import express from 'express';
import dotenv from 'dotenv';
import { PORT } from './config.js';
import carRoutes from './routes/cars.routes.js';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createClient } from 'redis';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());


// Configuración de Redis
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect()
  .then(() => {
    console.log('Conectado a Redis');
  })
  .catch((err) => {
    console.error('Error al conectar con Redis:', err);
  });

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cars API',
      version: '1.0.0',
      description: 'API para gestionar coches',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/cars.routes.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(carRoutes);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/swagger`);
});

export { redisClient };
