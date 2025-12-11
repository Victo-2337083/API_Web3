import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors';

// composants Swagger
import BaseRouter, { swaggerUi, swaggerDocument } from '@src/routes'; 

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { NodeEnvs } from '@src/common/constants';
import skipTokenCheck from './services/skipTokenCheck';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// **** CORS Configuration **** //
const allowedOrigins = [
  'https://frontendfinaleweb3-ad4m.onrender.com',
  process.env.FRONTEND_URL,
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// **** Middleware **** //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security middleware
if (ENV.NodeEnv === NodeEnvs.Prod) {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }));
} else if (!process.env.DISABLE_HELMET) {
  app.use(helmet());
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: ENV.NodeEnv
  });
});

// Swagger
app.use(Paths.Base + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// **** SkipTokenCheck Middleware **** //
// Routes publiques (login, création utilisateur, health) passent sans JWT
app.use(Paths.Base, skipTokenCheck);

// API routes
app.use(Paths.Base, BaseRouter);

// **** Error Handling Middleware **** //
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Prod) {
    logger.err(err, true);
  }

  let status = HttpStatusCodes.BAD_REQUEST;

  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  } else if (err.message === 'Not allowed by CORS') {
    res.status(HttpStatusCodes.FORBIDDEN).json({ error: 'CORS policy violation' });
  } else {
    res.status(status).json({
      error: ENV.NodeEnv === NodeEnvs.Prod
        ? 'Internal server error'
        : err.message
    });
  }

  return next(err);
});

export default app;
