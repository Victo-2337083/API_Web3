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
exports.Utilisateur = void 0;
exports.__new__ = __new__;
exports.test = test;
exports.testlogin = testlogin;
const mongoose_1 = __importStar(require("mongoose"));
const utils_1 = require("jet-validators/utils");
const jet_validators_1 = require("jet-validators");
const validators_1 = require("@src/common/util/validators");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
/******************************************************************************/
/* Parsers                                                                    */
/******************************************************************************/
const parseUtilisateur = (0, utils_1.parseObject)({
    id: jet_validators_1.isString,
    nom: jet_validators_1.isString,
    prenom: jet_validators_1.isString,
    email: jet_validators_1.isString,
    motDePasse: jet_validators_1.isString,
    role: jet_validators_1.isString,
    telephone: jet_validators_1.isString,
    statut: jet_validators_1.isString,
    derniereConnexion: validators_1.transIsDate,
    _id: validators_1.isRelationalKey,
});
const parseUserLogin = (0, utils_1.parseObject)({
    email: jet_validators_1.isString,
    motDePasse: jet_validators_1.isString,
});
/******************************************************************************/
/* Schemas                                                                    */
/******************************************************************************/
const UtilisateurSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true, maxlength: 100 },
    nom: { type: String, required: [true, 'Le nom est obligatoire. Exemple : "Fouowa"'], maxlength: [100, 'Nom max 100 caractères.'] },
    prenom: { type: String, required: [true, 'Le prénom est obligatoire. Exemple : "Bady"'], maxlength: [100, 'Prénom max 100 caractères.'] },
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire. Exemple : "bady@mail.com"'],
        unique: true,
        match: [/.+@.+\..+/, 'Email invalide. Exemple : "bady@mail.com"'],
    },
    motDePasse: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire. Exemple : "MonPass@123"'],
        minlength: [8, 'Le mot de passe doit avoir au moins 8 caractères.'],
    },
    role: { type: String, enum: { values: ['Admin', 'Comptable', 'Employé'], message: 'Rôle invalide. Exemple : "Comptable"' }, required: true },
    telephone: { type: String, maxlength: [20, 'Téléphone max 20 caractères. Exemple : "+1 514 123 4567"'] },
    statut: { type: String, enum: { values: ['Actif', 'Inactif', 'Suspendu'], message: 'Statut invalide. Exemple : "Actif"' }, required: true, default: 'Actif' },
    derniereConnexion: { type: Date },
}, { collection: 'Utilisateurs', timestamps: true });
/**
 * Middleware Mongoose 'pre-save' pour hacher le mot de passe avant la sauvegarde
 */
UtilisateurSchema.pre('save', async function (next) {
    if (!this.isModified('motDePasse')) {
        return next();
    }
    try {
        const hash = await bcryptjs_1.default.hash(this.motDePasse, SALT_ROUNDS);
        this.motDePasse = hash;
        next();
    }
    catch (error) {
        const err = error;
        console.error('Erreur lors du hachage du mot de passe:', err);
        next(new Error('Erreur de hachage du mot de passe.'));
    }
});
mongoose_1.default.pluralize(null);
exports.Utilisateur = (0, mongoose_1.model)('Utilisateurs', UtilisateurSchema);
/*******************************************************************************/
/* Fonctions                                                                   */
/******************************************************************************/
const DEFAULT_UTILISATEUR_VALS = () => ({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'Employé',
    statut: 'Actif',
});
function __new__(user) {
    const retVal = { ...DEFAULT_UTILISATEUR_VALS(), ...user };
    return parseUtilisateur(retVal, (errors) => {
        throw new Error('Échec de la création du nouvel utilisateur : ' + JSON.stringify(errors, null, 2));
    });
}
function test(arg, errCb) {
    return !!parseUtilisateur(arg, errCb);
}
function testlogin(arg, errCb) {
    return !!parseUserLogin(arg, errCb);
}
exports.default = {
    new: __new__,
    test,
    testlogin,
    Utilisateur: exports.Utilisateur,
};
