"use strict";
// src/routes/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = exports.swaggerUi = void 0;
const express_1 = require("express");
const Paths_1 = __importDefault(require("@src/common/constants/Paths"));
const JetonRoutes_1 = __importDefault(require("./JetonRoutes"));
const FactureRoutes_1 = __importDefault(require("./FactureRoutes"));
const UtilisateursRoute_1 = __importDefault(require("./UtilisateursRoute"));
// import pour  SWAGGER ---
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = require("path");
// Chargement de la spécification OpenAPI
const swaggerDocument = yamljs_1.default.load((0, path_1.resolve)(__dirname, '../swagger.yaml'));
exports.swaggerDocument = swaggerDocument;
// ----------------------------
const apiRouter = (0, express_1.Router)();
// Init token router
const tokenRouter = (0, express_1.Router)();
// Generate Token
tokenRouter.post(Paths_1.default.GenerateToken.Get, JetonRoutes_1.default.generateToken);
apiRouter.use(Paths_1.default.GenerateToken.Base, tokenRouter);
// ROUTEUR FACTURES ---
const factureRouter = (0, express_1.Router)();
factureRouter.get(Paths_1.default.Factures.Get, FactureRoutes_1.default.getAll);
factureRouter.get(Paths_1.default.Factures.GetByNumber, FactureRoutes_1.default.getOne);
factureRouter.post(Paths_1.default.Factures.Add, FactureRoutes_1.default.add);
factureRouter.put(Paths_1.default.Factures.Update, FactureRoutes_1.default.update);
// Route spécifique : Recherche par service 
factureRouter.get(Paths_1.default.Services.GetByService, FactureRoutes_1.default.getByService);
// Montage de la sous-route 'factures'
apiRouter.use(Paths_1.default.Factures.Base, factureRouter);
const serviceRouter = (0, express_1.Router)();
serviceRouter.get(Paths_1.default.Services.GetByService, FactureRoutes_1.default.getByService);
apiRouter.use(Paths_1.default.Services.Base, serviceRouter);
const bcRouter = (0, express_1.Router)();
// CRUD et spécifique
const fournisseurRouter = (0, express_1.Router)();
// CRUD
// ROUTEUR UTILISATEURS ---
const utilisateurRouter = (0, express_1.Router)();
utilisateurRouter.get(Paths_1.default.Utilisateurs.Get, UtilisateursRoute_1.default.getAll);
utilisateurRouter.get(Paths_1.default.Utilisateurs.GetByEmail, UtilisateursRoute_1.default.getOne);
utilisateurRouter.post(Paths_1.default.Utilisateurs.Add, UtilisateursRoute_1.default.add);
utilisateurRouter.put(Paths_1.default.Utilisateurs.Update, UtilisateursRoute_1.default.update);
utilisateurRouter.get(Paths_1.default.Utilisateurs.GetByRole, UtilisateursRoute_1.default.getByRole);
// Montage de la sous-route 'utilisateurs'
apiRouter.use(Paths_1.default.Utilisateurs.Base, utilisateurRouter);
exports.default = apiRouter;
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
