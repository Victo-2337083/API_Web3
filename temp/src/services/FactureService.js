"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_DATA_ERR = exports.FACTURE_NOT_FOUND_ERR = void 0;
const FactureRepo_1 = __importDefault(require("@src/repos/FactureRepo"));
exports.FACTURE_NOT_FOUND_ERR = 'Facture non trouvée';
exports.INVALID_DATA_ERR = 'Les données fournies sont invalides';
async function getAll() {
    try {
        const factures = await FactureRepo_1.default.getAll();
        return factures;
    }
    catch (err) {
        console.error('[Service][getAll] Erreur :', err);
        throw new Error(err.message || 'Impossible de récupérer les factures.');
    }
}
async function getOne(numero) {
    if (!numero || numero < 1000 || numero > 999999) {
        throw new Error(exports.INVALID_DATA_ERR + ' : le numéro de facture doit être entre 1000 et 999999');
    }
    try {
        const facture = await FactureRepo_1.default.getOne(numero);
        if (!facture) {
            console.warn(`[Service][getOne] Facture non trouvée pour le numéro : ${numero}`);
            throw new Error(exports.FACTURE_NOT_FOUND_ERR);
        }
        return facture;
    }
    catch (err) {
        if (err.message === exports.FACTURE_NOT_FOUND_ERR) {
            throw err;
        }
        console.error(`[Service][getOne] Erreur pour le numéro ${numero}:`, err);
        throw new Error(err.message || 'Impossible de récupérer la facture.');
    }
}
async function addOne(facture) {
    if (!facture?.numeroFacture || !facture.articles || facture.articles.length === 0) {
        throw new Error(exports.INVALID_DATA_ERR + ' : le numéro de facture et les articles sont requis');
    }
    try {
        const created = await FactureRepo_1.default.add(facture);
        return created;
    }
    catch (err) {
        console.error('[Service][addOne] Erreur :', err);
        throw new Error(err.message || "Impossible d'ajouter la facture.");
    }
}
async function updateOne(facture) {
    if (!facture?.numeroFacture) {
        throw new Error(exports.INVALID_DATA_ERR + ' : le numéro de la facture est requis pour la mise à jour');
    }
    try {
        const updated = await FactureRepo_1.default.update(facture);
        if (!updated) {
            throw new Error(exports.FACTURE_NOT_FOUND_ERR);
        }
        return updated;
    }
    catch (err) {
        console.error(`[Service][updateOne] Erreur pour le numéro ${facture.numeroFacture}:`, err);
        if (err.name === 'ValidationError') {
            throw new Error(exports.INVALID_DATA_ERR + ': ' + err.message);
        }
        throw new Error(err.message || 'Impossible de mettre à jour la facture.');
    }
}
async function getByService(service) {
    if (!service || service.trim() === '') {
        throw new Error(exports.INVALID_DATA_ERR + " : la description de l'article est requise");
    }
    try {
        const factures = await FactureRepo_1.default.getByService(service);
        return factures;
    }
    catch (err) {
        console.error(`[Service][getByService] Erreur pour le service ${service}:`, err);
        throw new Error(err.message || 'Impossible de récupérer les factures pour cet article.');
    }
}
exports.default = {
    getAll,
    getOne,
    addOne,
    updateOne,
    getByService,
};
