import 'reflect-metadata';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import '@shared/container';

import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';
import { AppDataSource, MongoDataSource } from '../typeorm';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

AppDataSource.initialize()
  .then(() => {
    console.log('🛢 App Data Source has been initialized!');
    app.listen(3333, () => {
      console.log('🚀 Server started on port 3333!');
    });
  })
  .catch(err => {
    console.log('Error during App Data Source initialization', err);
  });

MongoDataSource.initialize()
  .then(() => {
    console.log('🛢 MongoDB Data Source has been initialized!');
  })
  .catch(err => {
    console.log('Error during MongoDB Data Source initialization', err);
  });

export default app;
