"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facture = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FactureSchema = new mongoose_1.Schema({
    numeroFacture: {
        type: Number,
        required: [true, 'Le numéro de facture est obligatoire. Exemple : 4122'],
        unique: true,
        min: [1000, 'Le numéro doit être >= 1000. Exemple : 4122'],
        max: [999999, 'Le numéro doit être <= 999999. Exemple : 985432'],
    },
    dateFacture: {
        type: Date,
        required: [true, 'La date de facture est obligatoire. Exemple : "2025-09-29"'],
    },
    dateEcheance: {
        type: Date,
        required: [true, 'La date d’échéance est obligatoire. Exemple : "2025-10-29"'],
    },
    fournisseurId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Fournisseur', required: [true, 'L’ID du fournisseur est obligatoire.'] },
    utilisateurId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Utilisateur', required: [true, 'L’ID de l’utilisateur est obligatoire.'] },
    montantHT: { type: Number, required: [true, 'Le montant HT est obligatoire.'], min: [0, 'Le montant HT ne peut pas être négatif.'] },
    montantTVA: { type: Number, required: [true, 'Le montant TVA est obligatoire.'], min: [0, 'Le montant TVA ne peut pas être négatif.'] },
    montantTTC: { type: Number, required: [true, 'Le montant TTC est obligatoire.'], min: [0, 'Le montant TTC ne peut pas être négatif.'] },
    devise: { type: String, required: [true, 'La devise est obligatoire. Exemple : "CAD"'], maxlength: [10, 'La devise ne peut pas dépasser 10 caractères.'] },
    statut: { type: String, enum: { values: ['Payée', 'En attente', 'Partiellement payée'], message: 'Statut invalide. Exemple : "Payée"' }, required: true, default: 'En attente' },
    modePaiement: { type: String, enum: { values: ['Virement', 'Carte', 'Chèque', 'Espèces'], message: 'Mode de paiement invalide. Exemple : "Virement"' }, required: true },
    articles: [
        {
            description: { type: String, required: [true, 'La description est obligatoire. Exemple : "Ordinateur portable HP"'], maxlength: [255, 'La description max est 255 caractères.'] },
            quantite: { type: Number, required: [true, 'La quantité est obligatoire. Exemple : 2'], min: [1, 'La quantité doit être >= 1.'] },
            prixUnitaire: { type: Number, required: [true, 'Le prix unitaire est obligatoire. Exemple : 500'], min: [0, 'Le prix unitaire ne peut pas être négatif.'] },
            tauxTVA: { type: Number, required: [true, 'Le taux TVA est obligatoire. Exemple : 20'], min: [0, 'Le taux TVA doit être >= 0.'] },
            totalLigne: { type: Number, required: [true, 'Le total de la ligne est obligatoire. Exemple : 1000'], min: [0, 'Le total ligne doit être >= 0.'] },
        },
    ],
    notes: { type: String, maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères. Exemple : "Facture réglée par virement le 01/10/2025"'] },
}, { collection: 'Factures', timestamps: true });
FactureSchema.pre('save', function (next) {
    let totalHT = 0;
    let totalTVA = 0;
    this.articles.forEach(article => {
        const ligneHT = article.quantite * article.prixUnitaire;
        const ligneTVA = ligneHT * (article.tauxTVA / 100);
        article.totalLigne = ligneHT + ligneTVA;
        totalHT += ligneHT;
        totalTVA += ligneTVA;
    });
    this.montantHT = totalHT;
    this.montantTVA = totalTVA;
    this.montantTTC = totalHT + totalTVA;
    next();
});
mongoose_1.default.pluralize(null);
exports.Facture = (0, mongoose_1.model)('Factures', FactureSchema);
