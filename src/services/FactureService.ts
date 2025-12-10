import FactureRepo from '@src/repos/FactureRepo';
import { IFacture } from '@src/models/Facture';

export const FACTURE_NOT_FOUND_ERR = 'Facture non trouvée';
export const INVALID_DATA_ERR = 'Les données fournies sont invalides';

/******************************************************************************/
/* Fonctions                                                                  */
/******************************************************************************/

/**
 * Lire toutes les factures
 */
async function getAll(): Promise<IFacture[]> {
  try {
    const factures = await FactureRepo.getAll();
    return factures;
  } catch (err: any) {
    console.error('[Service][getAll] Erreur :', err);
    
    throw new Error(err.message || 'Impossible de récupérer les factures.'); 
  }
}

/**
 * Lire une facture par son numéro
 */
async function getOne(numero: number): Promise<IFacture> {
  // Alignement avec la validation du modèle (max 999999)
  if (!numero || numero < 1000 || numero > 999999) { 
    throw new Error(INVALID_DATA_ERR + ' : le numéro de facture doit être entre 1000 et 999999');
  }
  try {
    const facture = await FactureRepo.getOne(numero);
    if (!facture) {
      console.warn(`[Service][getOne] Facture non trouvée pour le numéro : ${numero}`);
      //lance une erreur spécifique pour que le contrôleur la gère 
      throw new Error(FACTURE_NOT_FOUND_ERR); 
    }
    return facture;
  } catch (err: any) {
    if (err.message === FACTURE_NOT_FOUND_ERR) {
      throw err; 
    }
    console.error(`[Service][getOne] Erreur pour le numéro ${numero}:`, err);
    throw new Error(err.message || 'Impossible de récupérer la facture.');
  }
}

/**
 * Ajouter une facture
 */
async function addOne(facture: IFacture): Promise<IFacture> {
  if (!facture?.numeroFacture || !facture.articles || facture.articles.length === 0) {
    throw new Error(INVALID_DATA_ERR + ' : le numéro de facture et les articles sont requis');
  }
  try {
    // Le repository gère l'ajout et les validations Mongoose
    const created = await FactureRepo.add(facture);
    return created;
  } catch (err: any) {
    console.error('[Service][addOne] Erreur :', err);
    // Laisse le message d'erreur d'origine (validation Mongoose, doublon, etc.) remonter
    throw new Error(err.message || "Impossible d'ajouter la facture.");
  }
}

/**
 * Mettre à jour une facture
 */
async function updateOne(facture: IFacture): Promise<IFacture> {
  //  Le corps de l'erreur est 'facture'
  if (!facture?.numeroFacture) { 
    throw new Error(INVALID_DATA_ERR + ' : le numéro de la facture est requis pour la mise à jour');
  }
  try {
    const updated = await FactureRepo.update(facture);
    if (!updated) {
      // Le repository est censé lancer une erreur si non trouvé
      throw new Error(FACTURE_NOT_FOUND_ERR); 
    }
    return updated;
  } catch (err: any) {
    console.error(`[Service][updateOne] Erreur pour le numéro ${facture.numeroFacture}:`, err);

    // Si c'est une erreur de validation Mongoose, on lance une erreur 400
    if (err.name === 'ValidationError') {
      throw new Error(INVALID_DATA_ERR + ': ' + err.message); 
    }
    
    throw new Error(err.message || 'Impossible de mettre à jour la facture.');
  }
}

/**
 * Extraire toutes les factures ayant un article (service) spécifique
 */
async function getByService(service: string): Promise<IFacture[]> {
  if (!service || service.trim() === '') {
    throw new Error(INVALID_DATA_ERR + " : la description de l'article est requise");
  }
  try {
    const factures = await FactureRepo.getByService(service);
    return factures;
  } catch (err: any) {
    console.error(`[Service][getByService] Erreur pour le service ${service}:`, err);
    throw new Error(err.message || 'Impossible de récupérer les factures pour cet article.');
  }
}

/******************************************************************************/
/* Export default                                                             */
/******************************************************************************/

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  getByService,
} as const;