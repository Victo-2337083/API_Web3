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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodes_1 = __importDefault(require("@src/common/constants/HttpStatusCodes"));
const FactureService_1 = __importStar(require("@src/services/FactureService"));
// **** Fonctions **** //
/**
 * Extraire toutes les factures
 */
async function getAll(_, res) {
    try {
        const factures = await FactureService_1.default.getAll();
        return res
            .status(HttpStatusCodes_1.default.OK)
            .json({ success: true, count: factures.length, factures });
    }
    catch (err) {
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
/**
 * Extraire une facture par son numéro
 */
async function getOne(req, res) {
    try {
        const { numero } = req.params;
        if (!numero || isNaN(Number(numero))) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Le paramètre 'numero' est manquant ou invalide" });
        }
        const facture = await FactureService_1.default.getOne(Number(numero));
        // Vérifier si le service a trouvé la facture
        if (!facture) {
            return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ error: FactureService_1.FACTURE_NOT_FOUND_ERR });
        }
        return res.status(HttpStatusCodes_1.default.OK).json({ success: true, facture });
    }
    catch (err) {
        // Gestion des erreurs spécifiques du service
        if (err.message.includes(FactureService_1.FACTURE_NOT_FOUND_ERR)) {
            return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ error: err.message });
        }
        if (err.message.includes(FactureService_1.INVALID_DATA_ERR)) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
/**
 * Ajouter une facture
 */
async function add(req, res) {
    try {
        const { facture } = req.body;
        if (!facture) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Corps de requête invalide, 'facture' est requis" });
        }
        const newFacture = await FactureService_1.default.addOne(facture);
        return res
            .status(HttpStatusCodes_1.default.CREATED)
            .json({ success: true, facture: newFacture });
    }
    catch (err) {
        // Les erreurs de validation ou de doublon Mongoose arrivent ici
        if (err.message.includes(FactureService_1.INVALID_DATA_ERR) || err.message.includes('obligatoire') || err.message.includes('existe déjà')) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
/**
 * Mettre à jour une facture
 */
async function update(req, res) {
    try {
        const { facture } = req.body;
        if (!facture) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Le corps doit contenir une 'facture' avec son numéro." });
        }
        const updated = await FactureService_1.default.updateOne(facture);
        return res.status(HttpStatusCodes_1.default.OK).json({ success: true, updated });
    }
    catch (err) {
        if (err.message.includes(FactureService_1.FACTURE_NOT_FOUND_ERR)) {
            return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ error: err.message });
        }
        if (err.message.includes(FactureService_1.INVALID_DATA_ERR) || err.message.includes('obligatoire')) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
/**
 * Extraire toutes les factures ayant un service spécifique
 */
async function getByService(req, res) {
    try {
        const { nomservice } = req.params;
        if (!nomservice) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Paramètre 'nomservice' (description de l'article) manquant" });
        }
        const factures = await FactureService_1.default.getByService(nomservice);
        return res
            .status(HttpStatusCodes_1.default.OK)
            .json({ success: true, count: factures.length, factures });
    }
    catch (err) {
        if (err.message.includes(FactureService_1.INVALID_DATA_ERR)) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
// **** Export default **** //
exports.default = {
    getAll,
    getOne,
    add,
    update,
    getByService,
};
