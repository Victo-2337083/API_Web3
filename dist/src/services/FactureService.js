"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_DATA_ERR = exports.FACTURE_NOT_FOUND_ERR = void 0;
const FactureRepo_1 = __importDefault(require("@src/repos/FactureRepo"));
exports.FACTURE_NOT_FOUND_ERR = 'Facture non trouvée';
exports.INVALID_DATA_ERR = 'Les données fournies sont invalides';
/******************************************************************************/
/* Fonctions                                                                  */
/******************************************************************************/
/**
 * Lire toutes les factures
 */
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
/**
 * Lire une facture par son numéro
 */
async function getOne(numero) {
    // Alignement avec la validation du modèle (max 999999)
    if (!numero || numero < 1000 || numero > 999999) {
        throw new Error(exports.INVALID_DATA_ERR + ' : le numéro de facture doit être entre 1000 et 999999');
    }
    try {
        const facture = await FactureRepo_1.default.getOne(numero);
        if (!facture) {
            console.warn(`[Service][getOne] Facture non trouvée pour le numéro : ${numero}`);
            //lance une erreur spécifique pour que le contrôleur la gère 
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
/**
 * Ajouter une facture
 */
async function addOne(facture) {
    if (!facture?.numeroFacture || !facture.articles || facture.articles.length === 0) {
        throw new Error(exports.INVALID_DATA_ERR + ' : le numéro de facture et les articles sont requis');
    }
    try {
        // Le repository gère l'ajout et les validations Mongoose
        const created = await FactureRepo_1.default.add(facture);
        return created;
    }
    catch (err) {
        console.error('[Service][addOne] Erreur :', err);
        // Laisse le message d'erreur d'origine (validation Mongoose, doublon, etc.) remonter
        throw new Error(err.message || "Impossible d'ajouter la facture.");
    }
}
/**
 * Mettre à jour une facture
 */
async function updateOne(facture) {
    //  Le corps de l'erreur est 'facture'
    if (!facture?.numeroFacture) {
        throw new Error(exports.INVALID_DATA_ERR + ' : le numéro de la facture est requis pour la mise à jour');
    }
    try {
        const updated = await FactureRepo_1.default.update(facture);
        if (!updated) {
            // Le repository est censé lancer une erreur si non trouvé
            throw new Error(exports.FACTURE_NOT_FOUND_ERR);
        }
        return updated;
    }
    catch (err) {
        console.error(`[Service][updateOne] Erreur pour le numéro ${facture.numeroFacture}:`, err);
        // Si c'est une erreur de validation Mongoose, on lance une erreur 400
        if (err.name === 'ValidationError') {
            throw new Error(exports.INVALID_DATA_ERR + ': ' + err.message);
        }
        throw new Error(err.message || 'Impossible de mettre à jour la facture.');
    }
}
/**
 * Extraire toutes les factures ayant un article (service) spécifique
 */
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
/******************************************************************************/
/* Export default                                                             */
/******************************************************************************/
exports.default = {
    getAll,
    getOne,
    addOne,
    updateOne,
    getByService,
};
