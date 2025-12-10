import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';
import FactureService, { FACTURE_NOT_FOUND_ERR, INVALID_DATA_ERR } from '@src/services/FactureService';
import { IFacture } from '@src/models/Facture';

// **** Fonctions **** //

/**
 * Extraire toutes les factures
 */
async function getAll(_: IReq, res: IRes) {
  try {
    const factures = await FactureService.getAll();
    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, count: factures.length, factures });
  } catch (err: any) {
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

/**
 * Extraire une facture par son numéro
 */
async function getOne(req: IReq, res: IRes) {
  try {
    const { numero } = req.params;
    if (!numero || isNaN(Number(numero))) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Le paramètre 'numero' est manquant ou invalide" });
    }

    const facture = await FactureService.getOne(Number(numero));
    // Vérifier si le service a trouvé la facture
    if (!facture) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ error: FACTURE_NOT_FOUND_ERR });
    }
    
    return res.status(HttpStatusCodes.OK).json({ success: true, facture });
  } catch (err: any) {
    // Gestion des erreurs spécifiques du service
    if (err.message.includes(FACTURE_NOT_FOUND_ERR)) {
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
 * Ajouter une facture
 */
async function add(req: IReq, res: IRes) {
  try {
    const { facture } = req.body;
    if (!facture) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Corps de requête invalide, 'facture' est requis" });
    }

    const newFacture = await FactureService.addOne(facture as IFacture);
    return res
      .status(HttpStatusCodes.CREATED)
      .json({ success: true, facture: newFacture });
  } catch (err: any) {
    // Les erreurs de validation ou de doublon Mongoose arrivent ici
    if (err.message.includes(INVALID_DATA_ERR) || err.message.includes('obligatoire') || err.message.includes('existe déjà')) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
}

/**
 * Mettre à jour une facture
 */
async function update(req: IReq, res: IRes) {
  try {
    const { facture } = req.body;
    if (!facture) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
      
        .json({ error: "Le corps doit contenir une 'facture' avec son numéro." }); 
    }

    const updated = await FactureService.updateOne(facture as IFacture);
    return res.status(HttpStatusCodes.OK).json({ success: true, updated });
  } catch (err: any) {
  
    if (err.message.includes(FACTURE_NOT_FOUND_ERR)) {
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
 * Extraire toutes les factures ayant un service spécifique
 */
async function getByService(req: IReq, res: IRes) {
  try {
    const { nomservice } = req.params; 
    if (!nomservice) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: "Paramètre 'nomservice' (description de l'article) manquant" });
    }

    const factures = await FactureService.getByService(nomservice as string);
    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, count: factures.length, factures });
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
  getByService,
} as const;