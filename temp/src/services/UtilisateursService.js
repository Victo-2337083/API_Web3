"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_DATA_ERR = exports.UTILISATEUR_NOT_FOUND_ERR = void 0;
const UtilisateursRepo_1 = __importDefault(require("@src/repos/UtilisateursRepo"));
exports.UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
exports.INVALID_DATA_ERR = 'Les données fournies sont invalides';
async function getAll() {
    try {
        const utilisateurs = await UtilisateursRepo_1.default.getAll();
        return utilisateurs;
    }
    catch (err) {
        console.error('[Service][getAll] Erreur :', err);
        throw new Error(err.message || 'Impossible de récupérer les utilisateurs.');
    }
}
async function getOne(email) {
    if (!email || email.trim() === '') {
        throw new Error(exports.INVALID_DATA_ERR + " : l'email est requis");
    }
    try {
        const utilisateur = await UtilisateursRepo_1.default.getOne(email);
        if (!utilisateur) {
            throw new Error(exports.UTILISATEUR_NOT_FOUND_ERR);
        }
        return utilisateur;
    }
    catch (err) {
        if (err.message === exports.UTILISATEUR_NOT_FOUND_ERR) {
            throw err;
        }
        console.error(`[Service][getOne] Erreur pour l'email ${email}:`, err);
        throw new Error(err.message || "Impossible de récupérer l'utilisateur.");
    }
}
async function addOne(utilisateur) {
    if (!utilisateur?.email || !utilisateur.motDePasse) {
        throw new Error(exports.INVALID_DATA_ERR + " : l'email et le mot de passe sont requis");
    }
    try {
        const created = await UtilisateursRepo_1.default.add(utilisateur);
        return created;
    }
    catch (err) {
        console.error('[Service][addOne] Erreur :', err);
        throw new Error(err.message || "Impossible d'ajouter l'utilisateur.");
    }
}
async function updateOne(utilisateur) {
    if (!utilisateur?.email) {
        throw new Error(exports.INVALID_DATA_ERR + " : l'email de l'utilisateur est requis pour la mise à jour");
    }
    try {
        const updated = await UtilisateursRepo_1.default.update(utilisateur);
        if (!updated) {
            throw new Error(exports.UTILISATEUR_NOT_FOUND_ERR);
        }
        return updated;
    }
    catch (err) {
        console.error(`[Service][updateOne] Erreur pour l'email ${utilisateur.email}:`, err);
        if (err.message.includes('Utilisateur non trouvé') || err.message.includes(exports.UTILISATEUR_NOT_FOUND_ERR)) {
            throw new Error(exports.UTILISATEUR_NOT_FOUND_ERR);
        }
        throw new Error(err.message || "Impossible de mettre à jour l'utilisateur.");
    }
}
async function getByRole(role) {
    if (!role || role.trim() === '') {
        throw new Error(exports.INVALID_DATA_ERR + ' : le rôle est requis');
    }
    try {
        const utilisateurs = await UtilisateursRepo_1.default.getByRole(role);
        return utilisateurs;
    }
    catch (err) {
        console.error(`[Service][getByRole] Erreur pour le rôle ${role}:`, err);
        throw new Error(err.message || 'Impossible de récupérer les utilisateurs pour ce rôle.');
    }
}
exports.default = {
    getAll,
    getOne,
    addOne,
    updateOne,
    getByRole,
};
