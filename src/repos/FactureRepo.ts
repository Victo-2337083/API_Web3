import { IFacture, Facture } from '@src/models/Facture';

// **** Functions **** //

/**
 * Extraire toutes les factures
 */
async function getAll(): Promise<IFacture[]> {
  try {
    const factures = await Facture.find();
    if (!factures || factures.length === 0) {
      console.warn('[Repo][getAll] Aucune facture trouvée.');
    }
    return factures;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Repo][getAll] Erreur :', err);
    throw new Error('Erreur lors de la récupération de toutes les factures.');
  }
}

/**
 * Extraire une facture par son numéro
 * Validation ajustée pour respecter le modèle (max 999999)
 */
async function getOne(numero: number): Promise<IFacture | null> {
  if (!numero || numero < 1000 || numero > 999999) {
    throw new Error('Le numéro de facture doit être entre 1000 et 999999.');
  }
  try {
    const facture = await Facture.findOne({ numeroFacture: numero });
    return facture;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[Repo][getOne] Erreur avec numéro ${numero}:`, err);
    throw new Error('Erreur lors de la récupération de la facture.');
  }
}

/**
 * Ajouter une facture
 * Validation ajustée pour respecter le modèle
 */
async function add(facture: IFacture): Promise<IFacture> {
  if (!facture?.numeroFacture || !facture.articles || facture.articles.length === 0) {
    throw new Error('Les données de la facture sont invalides : le numéro et les articles sont obligatoires.');
  }
  try {
    const nouvelleFacture = new Facture(facture);
    // Le middleware 'pre('save')' dans le modèle s'exécutera ici pour calculer les totaux.
    const saved = await nouvelleFacture.save();
    console.log('[Repo][add] Facture ajoutée :', saved);
    return saved;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Repo][add] Erreur lors de l\'ajout :', err);
    // Gérer l'erreur de doublon 'numeroFacture' si 'unique: true' a été ajouté.
    if (err.message.includes('E11000 duplicate key')) {
      throw new Error('Le numéro de facture existe déjà.');
    }
    throw new Error('Impossible d\'ajouter la facture.');
  }
}

/**
 * Vérifier si une facture existe par numeroFacture
 * Validation ajustée pour respecter le modèle
 */
async function persists(numeroFacture: number): Promise<boolean> {
  return (await Facture.findOne({ numeroFacture })) !== null;
}

/**
 * Mettre à jour une facture
 * Changement majeur : Utilisation de findOneAndUpdate par numeroFacture
 */
async function update(facture: IFacture): Promise<IFacture | null> {
  if (!facture?.numeroFacture) {
    throw new Error('Le numéro de facture est obligatoire pour mettre à jour une facture.');
  }
  try {
    // Vérifier si la facture existe
    const exists = await persists(facture.numeroFacture);

    if (!exists) {
      console.warn(`[Repo][update] Aucune facture trouvée avec numero: ${facture.numeroFacture}`);
      throw new Error('Facture non trouvée avec ce numéro.');
    }

    // L'option { new: true } retourne le document mis à jour
    // L'option { runValidators: true } exécute les validateurs du schéma
    const updated = await Facture.findOneAndUpdate(
      { numeroFacture: facture.numeroFacture },
      {
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
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      console.warn(`[Repo][update] Échec de la mise à jour pour le numero: ${facture.numeroFacture}`);
    } else {
      console.log('[Repo][update] Facture mise à jour :', updated);
    }
    return updated;
  } catch (error: unknown) {
    const err = error as Error & { name?: string };
    console.error(`[Repo][update] Erreur lors de la mise à jour du numero ${facture.numeroFacture}:`, err);

    // Si c'est une erreur de validation Mongoose, relancez l'erreur pour traitement en amont
    if (err.name === 'ValidationError') {
      throw err;
    }

    throw new Error('Impossible de mettre à jour la facture.');
  }
}

/**
 * Extraire toutes les factures ayant un article spécifique
 * Recherche par 'articles.description'
 */
async function getByService(description: string): Promise<IFacture[]> {
  if (!description || description.trim() === '') {
    throw new Error('Le nom de l\'article est requis pour rechercher des factures.');
  }
  try {
    // Recherche de la description dans le tableau 'articles'
    const factures = await Facture.find({ 'articles.description': description });
    if (!factures || factures.length === 0) {
      console.warn(`[Repo][getByService] Aucune facture trouvée pour le service/description: ${description}`);
    }
    return factures;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[Repo][getByService] Erreur avec description ${description}:`, err);
    throw new Error('Erreur lors de la récupération des factures par description.');
  }
}

//**** Export default ****//
export default {
  persists,
  getAll,
  getOne,
  add,
  update,
  getByService,
} as const;