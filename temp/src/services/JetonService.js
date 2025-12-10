"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UtilisateursRepo_1 = __importDefault(require("../repos/UtilisateursRepo"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function generateToken(utilisateur) {
    const utilisateurBD = await UtilisateursRepo_1.default.getOneWithPassword(utilisateur.email);
    if (utilisateurBD) {
        const isMatch = await bcryptjs_1.default.compare(utilisateur.motDePasse, utilisateurBD.motDePasse);
        if (isMatch) {
            const payload = {
                id: utilisateurBD._id,
                email: utilisateurBD.email,
                role: utilisateurBD.role,
            };
            return jsonwebtoken_1.default.sign(payload, ENV_1.default.Jwtsecret, { expiresIn: '24h' });
        }
    }
    return '';
}
exports.default = {
    generateToken,
};
