"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UtilisateursRepo_1 = __importDefault(require("../repos/UtilisateursRepo"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Générer un jeton pour un utilisateur
 *
 * @param {IUtilisateurLogin} utilisateur - L'utilisateur demandant le jeton
 * @returns {Promise<string>} - Le jeton signé
 */
async function generateToken(utilisateur) {
    // Recherche l'utilisateur par email AVEC le mot de passe haché
    //    On utilise getOneWithPassword du repo creeé précédemment
    const utilisateurBD = await UtilisateursRepo_1.default.getOneWithPassword(utilisateur.email);
    if (utilisateurBD) {
        //  Comparaison du mot de passe fourni avec le HACHAGE stocké
        //    motDePasse en BD est haché
        const isMatch = await bcryptjs_1.default.compare(utilisateur.motDePasse, utilisateurBD.motDePasse);
        if (isMatch) {
            //  Le mot de passe correspond, on génère le jeton
            const payload = {
                id: utilisateurBD._id,
                email: utilisateurBD.email,
                role: utilisateurBD.role,
            };
            return jsonwebtoken_1.default.sign(payload, ENV_1.default.Jwtsecret, { expiresIn: '24h' });
        }
    }
    // Si utilisateur non trouvé ou mot de passe invalide
    return '';
}
exports.default = {
    generateToken,
};
