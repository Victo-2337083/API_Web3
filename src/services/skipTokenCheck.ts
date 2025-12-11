import authenticateToken from './authenticateToken';
import { Request, Response, NextFunction } from 'express';
import Paths from '@src/common/constants/Paths';

// Liste des routes publiques et les méthodes HTTP autorisées
const publicRoutes = [
  { path: Paths.GenerateToken.Base + Paths.GenerateToken.Get, methods: ['POST'] },  // login
  { path: Paths.Utilisateurs.Base + Paths.Utilisateurs.Add, methods: ['POST'] },    // création utilisateur
  { path: Paths.Base + '/health', methods: ['GET'] },                               // health check
];

export default function skipTokenCheck(req: Request, res: Response, next: NextFunction) {
  // Vérifie si la route correspond à une route publique
  const isPublic = publicRoutes.some(route => {
    return route.path === req.baseUrl + req.path && route.methods.includes(req.method);
  });

  if (isPublic) {
    return next(); // passe le middleware d'authentification
  }

  // Sinon applique l'authentification JWT
  return authenticateToken(req, res, next);
}
