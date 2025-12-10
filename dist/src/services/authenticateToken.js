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
 * @param {NextFunction} next - La fonction à appeler pour continuer le processus.
 */
function authenticateToken(req, res, next) {
    const urlWithoutBase = req.url;
    const tokenPath = Paths_1.default.GenerateToken.Base;
    const swaggerPath = '/api-docs';
    // Exclure la route de génération de jeton et documentation
    if (urlWithoutBase.startsWith(tokenPath) || urlWithoutBase.startsWith(swaggerPath)) {
        next();
        return;
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    console.log('Token reçu:', token);
    if (!token) {
        return res.sendStatus(HttpStatusCodes_1.default.UNAUTHORIZED);
    }
    jsonwebtoken_1.default.verify(token, ENV_1.default.Jwtsecret, (err, user) => {
        if (err) {
            console.error('Erreur de vérification JWT:', err);
            if (err.name === 'TokenExpiredError') {
                return res
                    .status(HttpStatusCodes_1.default.FORBIDDEN)
                    .json({ message: 'Token expiré, veuillez vous reconnecter.' });
            }
            return res.sendStatus(HttpStatusCodes_1.default.FORBIDDEN);
        }
        req.user = user;
        next();
    });
}
exports.default = authenticateToken;
