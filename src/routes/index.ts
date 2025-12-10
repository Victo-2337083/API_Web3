// src/routes/index.ts

import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import JetonRoutes from './JetonRoutes';
import FactureRoutes from './FactureRoutes';
import UtilisateurRoutes from './UtilisateursRoute';

// import pour  SWAGGER ---
import swaggerUi from 'swagger-ui-express'; 
import YAML from 'yamljs';
import { resolve } from 'path';

// Chargement de la spécification OpenAPI
const swaggerDocument = YAML.load(resolve(__dirname, '../swagger.yaml')); 
// ----------------------------


const apiRouter = Router();


// Init token router
const tokenRouter = Router();

// Generate Token
tokenRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);


// ROUTEUR FACTURES ---
const factureRouter = Router();
factureRouter.get(Paths.Factures.Get, FactureRoutes.getAll);
factureRouter.get(Paths.Factures.GetByNumber, FactureRoutes.getOne);
factureRouter.post(Paths.Factures.Add, FactureRoutes.add);
factureRouter.put(Paths.Factures.Update, FactureRoutes.update);
// Route spécifique : Recherche par service 
factureRouter.get(Paths.Services.GetByService, FactureRoutes.getByService); 
// Montage de la sous-route 'factures'
apiRouter.use(Paths.Factures.Base, factureRouter);


const serviceRouter = Router();
serviceRouter.get(Paths.Services.GetByService, FactureRoutes.getByService);
apiRouter.use(Paths.Services.Base, serviceRouter);


const bcRouter = Router();
// CRUD et spécifique

const fournisseurRouter = Router();
// CRUD


// ROUTEUR UTILISATEURS ---
const utilisateurRouter = Router();
utilisateurRouter.get(Paths.Utilisateurs.Get, UtilisateurRoutes.getAll);
utilisateurRouter.get(Paths.Utilisateurs.GetByEmail, UtilisateurRoutes.getOne);
utilisateurRouter.post(Paths.Utilisateurs.Add, UtilisateurRoutes.add);
utilisateurRouter.put(Paths.Utilisateurs.Update, UtilisateurRoutes.update);
utilisateurRouter.get(Paths.Utilisateurs.GetByRole, UtilisateurRoutes.getByRole);
// Montage de la sous-route 'utilisateurs'
apiRouter.use(Paths.Utilisateurs.Base, utilisateurRouter);



// Exportez le routeur API et les composants Swagger
export { swaggerUi, swaggerDocument }; 
export default apiRouter;
/*

import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import JetonRoutes from './JetonRoutes';

// Importez les gestionnaires de routes pour chaque entité
import FactureRoutes from './FactureRoutes';
import UtilisateurRoutes from './UtilisateursRoute';



const apiRouter = Router();


// Init token router
const tokenRouter = Router();


// Generate Token
tokenRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);


// ROUTEUR FACTURES ---
const factureRouter = Router();

factureRouter.get(Paths.Factures.Get, FactureRoutes.getAll);
factureRouter.get(Paths.Factures.GetByNumber, FactureRoutes.getOne);
factureRouter.post(Paths.Factures.Add, FactureRoutes.add);
factureRouter.put(Paths.Factures.Update, FactureRoutes.update);
// Route spécifique : Recherche par service (article)
factureRouter.get(Paths.Services.GetByService, FactureRoutes.getByService); 
// Montage de la sous-route 'factures'
apiRouter.use(Paths.Factures.Base, factureRouter);


const serviceRouter = Router();
serviceRouter.get(Paths.Services.GetByService, FactureRoutes.getByService);
apiRouter.use(Paths.Services.Base, serviceRouter);


const bcRouter = Router();
// CRUD et spécifique
// Montage de la sous-route 'bonsdecommande'



//  ROUTEUR FOURNISSEURS ---
const fournisseurRouter = Router();
// CRUD
// Montage de la sous-route 'fournisseurs'



//  ROUTEUR UTILISATEURS ---
const utilisateurRouter = Router();
//  CRUD 

utilisateurRouter.get(Paths.Utilisateurs.Get, UtilisateurRoutes.getAll);
utilisateurRouter.get(Paths.Utilisateurs.GetByEmail, UtilisateurRoutes.getOne);
utilisateurRouter.post(Paths.Utilisateurs.Add, UtilisateurRoutes.add);
utilisateurRouter.put(Paths.Utilisateurs.Update, UtilisateurRoutes.update);
utilisateurRouter.get(Paths.Utilisateurs.GetByRole, UtilisateurRoutes.getByRole);
// Montage de la sous-route 'utilisateurs'
apiRouter.use(Paths.Utilisateurs.Base, utilisateurRouter);



export default apiRouter;
*/