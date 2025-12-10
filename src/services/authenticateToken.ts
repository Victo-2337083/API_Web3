import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ENV from '@src/common/constants/ENV';
import Paths from '@src/common/constants/Paths';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 *
 * @param {Request} req - La requête au serveur
 * @param {Response} res - La réponse du serveur
 * @param {NextFunction} next - La fonction à appeler pour continuer le processus.
 */
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const urlWithoutBase = req.url;
  const tokenPath = Paths.GenerateToken.Base;
  const swaggerPath = '/api-docs';
  // Exclure la route de génération de jeton et documentation
  if (urlWithoutBase.startsWith(tokenPath)|| urlWithoutBase.startsWith(swaggerPath)) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  console.log('Token reçu:', token);

  if (!token) {
    return res.sendStatus(HttpStatusCodes.UNAUTHORIZED); 
  }

  jwt.verify(token, ENV.Jwtsecret, (err: any, user: any) => {
    if (err) {
      console.error('Erreur de vérification JWT:', err);

      if (err.name === 'TokenExpiredError') {
        return res
          .status(HttpStatusCodes.FORBIDDEN) 
          .json({ message: 'Token expiré, veuillez vous reconnecter.' });
      }

      return res.sendStatus(HttpStatusCodes.FORBIDDEN); 
    }

    
    (req as any).user = user;
    next();
  });
}

export default authenticateToken;