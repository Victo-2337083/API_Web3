"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatusCodes_1 = __importDefault(require("@src/common/constants/HttpStatusCodes"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
const Paths_1 = __importDefault(require("@src/common/constants/Paths"));
/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 *
 * @param {Request} req - La requête au serveur
 * @param {Response} res - La réponse du serveur
 * @param {NextFunction} next - La fonction a appeler pour continuer le processus.
 */
function authenticateToken(req, res, next) {
    // Puisque l'intergiciel est monté sur Paths.Base (/api), req.url est le chemin interne.
    const urlWithoutBase = req.url;
    const tokenPath = Paths_1.default.GenerateToken.Base; // Ex: /generatetoken
    // Exclure la route de génération de jeton
    if (urlWithoutBase.startsWith(tokenPath)) {
        next();
        return;
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token reçu:', token);
    if (token == null)
        return res.sendStatus(HttpStatusCodes_1.default.UNAUTHORIZED);
    // CORRECTION : Utiliser ENV.Jwtsecret pour la vérification
    jsonwebtoken_1.default.verify(token, ENV_1.default.Jwtsecret, (err, user) => {
        console.log('Erreur de vérification JWT:', err);
        if (err)
            return res.sendStatus(HttpStatusCodes_1.default.FORBIDDEN);
        next();
    });
}
exports.default = authenticateToken;
