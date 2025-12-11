import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

// composants Swagger
import BaseRouter, { swaggerUi, swaggerDocument } from '@src/routes'; 

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { NodeEnvs } from '@src/common/constants';
import authenticateToken from './services/authenticateToken';
import cors from 'cors';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// **** CORS Configuration **** //
const allowedOrigins = [
  'http://localhost:3000',           
  'http://localhost:5173',           
  'http://localhost:5174',
    'http://localhost:1000', 
   'https://frontendfinaleweb3-ad4m.onrender.com',        
  process.env.FRONTEND_URL,         
];

app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin 
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
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

// SWAGGER 
app.use(Paths.Base + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

app.use(Paths.Base, authenticateToken);

// Add API routes 
app.use(Paths.Base, BaseRouter);

// error handling middleware
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

/******************************************************************************
                                Export default
******************************************************************************/
export default app;