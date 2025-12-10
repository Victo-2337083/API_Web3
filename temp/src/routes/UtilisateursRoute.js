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
const UtilisateursService_1 = __importStar(require("@src/services/UtilisateursService"));
async function getAll(_, res) {
    try {
        const utilisateurs = await UtilisateursService_1.default.getAll();
        return res
            .status(HttpStatusCodes_1.default.OK)
            .json({ success: true, count: utilisateurs.length, utilisateurs });
    }
    catch (err) {
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
async function getOne(req, res) {
    try {
        const { email } = req.params;
        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Le paramètre 'email' est manquant ou invalide." });
        }
        const utilisateur = await UtilisateursService_1.default.getOne(email);
        return res.status(HttpStatusCodes_1.default.OK).json({ success: true, utilisateur });
    }
    catch (err) {
        if (err.message.includes(UtilisateursService_1.UTILISATEUR_NOT_FOUND_ERR)) {
            return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ error: err.message });
        }
        if (err.message.includes(UtilisateursService_1.INVALID_DATA_ERR)) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
async function add(req, res) {
    try {
        const { utilisateur } = req.body;
        if (!utilisateur) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Corps de requête invalide, 'utilisateur' est requis" });
        }
        const newUtilisateur = await UtilisateursService_1.default.addOne(utilisateur);
        return res
            .status(HttpStatusCodes_1.default.CREATED)
            .json({ success: true, utilisateur: newUtilisateur });
    }
    catch (err) {
        if (err.message.includes(UtilisateursService_1.INVALID_DATA_ERR) || err.message.includes('obligatoire') || err.message.includes('existe déjà')) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
async function update(req, res) {
    try {
        const { utilisateur } = req.body;
        if (!utilisateur) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Le corps doit contenir un 'utilisateur' avec son email." });
        }
        const updated = await UtilisateursService_1.default.updateOne(utilisateur);
        return res.status(HttpStatusCodes_1.default.OK).json({ success: true, updated });
    }
    catch (err) {
        if (err.message.includes(UtilisateursService_1.UTILISATEUR_NOT_FOUND_ERR)) {
            return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ error: err.message });
        }
        if (err.message.includes(UtilisateursService_1.INVALID_DATA_ERR) || err.message.includes('obligatoire')) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
async function getByRole(req, res) {
    try {
        const { role } = req.params;
        if (!role) {
            return res
                .status(HttpStatusCodes_1.default.BAD_REQUEST)
                .json({ error: "Paramètre 'role' manquant" });
        }
        const utilisateurs = await UtilisateursService_1.default.getByRole(role);
        return res
            .status(HttpStatusCodes_1.default.OK)
            .json({ success: true, count: utilisateurs.length, utilisateurs });
    }
    catch (err) {
        if (err.message.includes(UtilisateursService_1.INVALID_DATA_ERR)) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ error: err.message });
        }
        return res
            .status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}
exports.default = {
    getAll,
    getOne,
    add,
    update,
    getByRole,
};
