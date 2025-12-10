"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facture_1 = require("@src/models/Facture");
async function getAll() {
    try {
        const factures = await Facture_1.Facture.find();
        if (!factures || factures.length === 0) {
            console.warn('[Repo][getAll] Aucune facture trouvée.');
        }
        return factures;
    }
    catch (error) {
        const err = error;
        console.error('[Repo][getAll] Erreur :', err);
        throw new Error('Erreur lors de la récupération de toutes les factures.');
    }
}
async function getOne(numero) {
    if (!numero || numero < 1000 || numero > 999999) {
        throw new Error('Le numéro de facture doit être entre 1000 et 999999.');
    }
    try {
        const facture = await Facture_1.Facture.findOne({ numeroFacture: numero });
        return facture;
    }
    catch (error) {
        const err = error;
        console.error(`[Repo][getOne] Erreur avec numéro ${numero}:`, err);
        throw new Error('Erreur lors de la récupération de la facture.');
    }
}
async function add(facture) {
    if (!facture?.numeroFacture || !facture.articles || facture.articles.length === 0) {
        throw new Error('Les données de la facture sont invalides : le numéro et les articles sont obligatoires.');
    }
    try {
        const nouvelleFacture = new Facture_1.Facture(facture);
        const saved = await nouvelleFacture.save();
        console.log('[Repo][add] Facture ajoutée :', saved);
        return saved;
    }
    catch (error) {
        const err = error;
        console.error('[Repo][add] Erreur lors de l\'ajout :', err);
        if (err.message.includes('E11000 duplicate key')) {
            throw new Error('Le numéro de facture existe déjà.');
        }
        throw new Error('Impossible d\'ajouter la facture.');
    }
}
async function persists(numeroFacture) {
    return (await Facture_1.Facture.findOne({ numeroFacture })) !== null;
}
async function update(facture) {
    if (!facture?.numeroFacture) {
        throw new Error('Le numéro de facture est obligatoire pour mettre à jour une facture.');
    }
    try {
        const exists = await persists(facture.numeroFacture);
        if (!exists) {
            console.warn(`[Repo][update] Aucune facture trouvée avec numero: ${facture.numeroFacture}`);
            throw new Error('Facture non trouvée avec ce numéro.');
        }
        const updated = await Facture_1.Facture.findOneAndUpdate({ numeroFacture: facture.numeroFacture }, {
            $set: {
                dateFacture: facture.dateFacture,
                dateEcheance: facture.dateEcheance,
                fournisseurId: facture.fournisseurId,
                utilisateurId: facture.utilisateurId,
                montantHT: facture.montantHT,
                montantTVA: facture.montantTVA,
                montantTTC: facture.montantTTC,
                devise: facture.devise,
                statut: facture.statut,
                modePaiement: facture.modePaiement,
                articles: facture.articles,
                notes: facture.notes ?? '',
            },
        }, { new: true, runValidators: true });
        if (!updated) {
            console.warn(`[Repo][update] Échec de la mise à jour pour le numero: ${facture.numeroFacture}`);
        }
        else {
            console.log('[Repo][update] Facture mise à jour :', updated);
        }
        return updated;
    }
    catch (error) {
        const err = error;
        console.error(`[Repo][update] Erreur lors de la mise à jour du numero ${facture.numeroFacture}:`, err);
        if (err.name === 'ValidationError') {
            throw err;
        }
        throw new Error('Impossible de mettre à jour la facture.');
    }
}
async function getByService(description) {
    if (!description || description.trim() === '') {
        throw new Error('Le nom de l\'article est requis pour rechercher des factures.');
    }
    try {
        const factures = await Facture_1.Facture.find({ 'articles.description': description });
        if (!factures || factures.length === 0) {
            console.warn(`[Repo][getByService] Aucune facture trouvée pour le service/description: ${description}`);
        }
        return factures;
    }
    catch (error) {
        const err = error;
        console.error(`[Repo][getByService] Erreur avec description ${description}:`, err);
        throw new Error('Erreur lors de la récupération des factures par description.');
    }
}
exports.default = {
    persists,
    getAll,
    getOne,
    add,
    update,
    getByService,
};
