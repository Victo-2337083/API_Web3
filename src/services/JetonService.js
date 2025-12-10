"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTILISATEUR_NOT_FOUND_ERR = void 0;
const Utilisateur_1 = require("@src/models/Utilisateur");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
exports.UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
/**
 * Générer un jeton pour un utilisateur
 *
 * @param {IUtilisateurLogin} utilisateur - L'utilisateur demandant le jeton
 * @returns {Promise<string>} - Le jeton signé
 */
async function generateToken(utilisateur) {
    // Recherche l'utilisateur dans MongoDB
    const utilisateurBD = await Utilisateur_1.Utilisateur.findOne({
        email: utilisateur.email,
        motDePasse: utilisateur.motDePasse,
    });
    if (utilisateurBD) {
        return jsonwebtoken_1.default.sign({ email: utilisateur.email }, ENV_1.default.Jwtsecret, { expiresIn: '1h' });
    }
    else {
        return '';
    }
}
exports.default = {
    generateToken,
};
