import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';
import UtilisateurService, { UTILISATEUR_NOT_FOUND_ERR, INVALID_DATA_ERR } from '@src/services/UtilisateursService';
import { IUtilisateur } from '@src/models/Utilisateur';

// **** Fonctions **** //

/**
 * Extraire tous les utilisateurs
 */
async function getAll(_: IReq, res: IRes) {
  try {
    const utilisateurs = await UtilisateurService.getAll();
    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, count: utilisateurs.length, utilisateurs });
  } catch (err: any) {
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

/**
 * Extraire un utilisateur par son email
 */
async function getOne(req: IReq, res: IRes) {
  try {
    const { email } = req.params; 

    if (!email || typeof email !== 'string' || email.trim().length === 0) { 
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Le paramètre 'email' est manquant ou invalide." });
    }

    const utilisateur = await UtilisateurService.getOne(email);
    return res.status(HttpStatusCodes.OK).json({ success: true, utilisateur });
  } catch (err: any) {
    if (err.message.includes(UTILISATEUR_NOT_FOUND_ERR)) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ error: err.message });
    }
    if (err.message.includes(INVALID_DATA_ERR)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

/**
 * Ajouter un utilisateur
 */
async function add(req: IReq, res: IRes) {
  try {
    const { utilisateur } = req.body;
    if (!utilisateur) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Corps de requête invalide, 'utilisateur' est requis" });
    }

    const newUtilisateur = await UtilisateurService.addOne(utilisateur as IUtilisateur);
    return res
      .status(HttpStatusCodes.CREATED)
      .json({ success: true, utilisateur: newUtilisateur });
  } catch (err: any) {
    if (err.message.includes(INVALID_DATA_ERR) || err.message.includes('obligatoire') || err.message.includes('existe déjà')) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

/**
 * Mettre à jour un utilisateur
 */
async function update(req: IReq, res: IRes) {
  try {
    const { utilisateur } = req.body;
    if (!utilisateur) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Le corps doit contenir un 'utilisateur' avec son email." }); 
    }

    const updated = await UtilisateurService.updateOne(utilisateur as IUtilisateur);
    return res.status(HttpStatusCodes.OK).json({ success: true, updated });
  } catch (err: any) {
    if (err.message.includes(UTILISATEUR_NOT_FOUND_ERR)) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ error: err.message });
    }
    if (err.message.includes(INVALID_DATA_ERR) || err.message.includes('obligatoire')) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

/**
 * Extraire tous les utilisateurs par rôle
 */
async function getByRole(req: IReq, res: IRes) {
  try {
    const { role } = req.params; 
    if (!role) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Paramètre 'role' manquant" });
    }

    const utilisateurs = await UtilisateurService.getByRole(role as string);
    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, count: utilisateurs.length, utilisateurs });
  } catch (err: any) {
    if (err.message.includes(INVALID_DATA_ERR)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  add,
  update,
  getByRole,
} as const;