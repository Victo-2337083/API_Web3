// src/server.ts

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
app.use(cors());

// **** Middleware **** //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security middleware
if (ENV.NodeEnv === NodeEnvs.Dev) {
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// ----------------------------------------------------------------------
// SWAGGER
app.use(Paths.Base + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
// ----------------------------------------------------------------------

// S'applique à tout ce qui reste sous  api
app.use(Paths.Base, authenticateToken);

//add API routes 
app.use(Paths.Base, BaseRouter);

// error handling middleware
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Dev.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

/******************************************************************************
                                Export default
******************************************************************************/
export default app;

