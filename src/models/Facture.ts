import mongoose, { Schema, model, Types } from 'mongoose';

/******************************************************************************/
/*                                         Types                             */
/******************************************************************************/

export interface IFacture {
  _id?: Types.ObjectId; 
  numeroFacture: number;
  dateFacture: Date;
  dateEcheance: Date;
  fournisseurId: Types.ObjectId;
  utilisateurId: Types.ObjectId;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  devise: string;
  statut: string;
  modePaiement: string;
  articles: {
    description: string;
    quantite: number;
    prixUnitaire: number;
    tauxTVA: number;
    totalLigne: number;
  }[];
  notes?: string;
}

/******************************************************************************/
/*                                Schemas                                     */
/******************************************************************************/

const FactureSchema = new Schema<IFacture>({
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
  fournisseurId: { type: Schema.Types.ObjectId, ref: 'Fournisseur', required: [true, 'L’ID du fournisseur est obligatoire.'] },
  utilisateurId: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: [true, 'L’ID de l’utilisateur est obligatoire.'] },
  
  montantHT: { type: Number, required: [true, 'Le montant HT est obligatoire.'], min: [0, 'Le montant HT ne peut pas être négatif.'] },
  montantTVA: { type: Number, required: [true, 'Le montant TVA est obligatoire.'], min: [0, 'Le montant TVA ne peut pas être négatif.'] },
  montantTTC: { type: Number, required: [true, 'Le montant TTC est obligatoire.'], min: [0, 'Le montant TTC ne peut pas être négatif.'] },
  devise: { type: String, required: [true, 'La devise est obligatoire. Exemple : "CAD"'], maxlength: [10, 'La devise ne peut pas dépasser 10 caractères.'] },
  statut: { type: String, enum: { values: ['Payée', 'En attente', 'Partiellement payée'], message: 'Statut invalide. Exemple : "Payée"' }, required: true, default: 'En attente' }, // Ajout de 'default'
  modePaiement: { type: String, enum: { values: ['Virement', 'Carte', 'Chèque', 'Espèces'], message: 'Mode de paiement invalide. Exemple : "Virement"' }, required: true },
  articles: [
    {
      description: { type: String, required: [true, 'La description est obligatoire. Exemple : "Ordinateur portable HP"'], maxlength: [255, 'La description max est 255 caractères.'] },
      quantite: { type: Number, required: [true, 'La quantité est obligatoire. Exemple : 2'], min: [1, 'La quantité doit être >= 1.'] },
      prixUnitaire: { type: Number, required: [true, 'Le prix unitaire est obligatoire. Exemple : 500'], min: [0, 'Le prix unitaire ne peut pas être négatif.'] },
      tauxTVA: { type: Number, required: [true, 'Le taux TVA est obligatoire. Exemple : 20'], min: [0, 'Le taux TVA doit être >= 0.'] },
      totalLigne: { type: Number, required: [true, 'Le total de la ligne est obligatoire. Exemple : 1000'], min: [0, 'Le total ligne doit être >= 0.'] }, // Calculé
    },
  ],
  notes: { type: String, maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères. Exemple : "Facture réglée par virement le 01/10/2025"'] },
}, { collection: 'Factures', timestamps: true });

// Middleware pour calculer les totaux avant la sauvegarde
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

  // Mise à jour des champs globaux de la facture
  this.montantHT = totalHT;
  this.montantTVA = totalTVA;
  this.montantTTC = totalHT + totalTVA;

  next();
});

// Désactiver la pluralisation automatique
mongoose.pluralize(null);

export const Facture = model<IFacture>('Factures', FactureSchema);