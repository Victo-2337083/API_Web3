import UtilisateurRepo from '@src/repos/UtilisateursRepo';
import { IUtilisateur } from '@src/models/Utilisateur';

/******************************************************************************/
/* Constants                                                                  */
/******************************************************************************/

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_DATA_ERR = 'Les données fournies sont invalides';

/******************************************************************************/
/* Functions                                                                  */
/******************************************************************************/

/**
 * Lire tous les utilisateurs
 */
async function getAll(): Promise<IUtilisateur[]> {
  try {
    const utilisateurs = await UtilisateurRepo.getAll();
    return utilisateurs;
  } catch (err: any) {
    console.error('[Service][getAll] Erreur :', err);
    throw new Error(err.message || 'Impossible de récupérer les utilisateurs.'); 
  }
}

/**
 * Lire un utilisateur par son email
 */
async function getOne(email: string): Promise<IUtilisateur> {
  if (!email || email.trim() === '') { 
    throw new Error(INVALID_DATA_ERR + " : l'email est requis");
  }

  
  try {
    const utilisateur = await UtilisateurRepo.getOne(email);
    if (!utilisateur) {
      throw new Error(UTILISATEUR_NOT_FOUND_ERR); 
    }
    return utilisateur;
  } catch (err: any) {
    if (err.message === UTILISATEUR_NOT_FOUND_ERR) {
      throw err;
    }
    console.error(`[Service][getOne] Erreur pour l'email ${email}:`, err);
    throw new Error(err.message || "Impossible de récupérer l'utilisateur.");
  }
}

/**
 * Ajouter un utilisateur
 */
async function addOne(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  if (!utilisateur?.email || !utilisateur.motDePasse) {
    throw new Error(INVALID_DATA_ERR + " : l'email et le mot de passe sont requis");
  }

  
  try {
    const created = await UtilisateurRepo.add(utilisateur);
    return created;
  } catch (err: any) {
    console.error('[Service][addOne] Erreur :', err);
    throw new Error(err.message || "Impossible d'ajouter l'utilisateur.");
  }
}

/**
 * Mettre à jour un utilisateur
 */
async function updateOne(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  if (!utilisateur?.email) { 
    throw new Error(INVALID_DATA_ERR + " : l'email de l'utilisateur est requis pour la mise à jour");
  }
  
  // Hachage du nouveau mot de passe  s'il est fourni
    

  try {
    const updated = await UtilisateurRepo.update(utilisateur);
    if (!updated) {
      throw new Error(UTILISATEUR_NOT_FOUND_ERR);
    }
    return updated;
  } catch (err: any) {
    console.error(`[Service][updateOne] Erreur pour l'email ${utilisateur.email}:`, err);
    if (err.message.includes('Utilisateur non trouvé') || err.message.includes(UTILISATEUR_NOT_FOUND_ERR)) {
      throw new Error(UTILISATEUR_NOT_FOUND_ERR);
    }
    throw new Error(err.message || "Impossible de mettre à jour l'utilisateur.");
  }
}

/**
 * Extraire tous les utilisateurs par rôle
 */
async function getByRole(role: string): Promise<IUtilisateur[]> {
  if (!role || role.trim() === '') {
    throw new Error(INVALID_DATA_ERR + ' : le rôle est requis');
  }
  try {
    const utilisateurs = await UtilisateurRepo.getByRole(role);
    return utilisateurs;
  } catch (err: any) {
    console.error(`[Service][getByRole] Erreur pour le rôle ${role}:`, err);
    throw new Error(err.message || 'Impossible de récupérer les utilisateurs pour ce rôle.');
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
  getByRole,
} as const;