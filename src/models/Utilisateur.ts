import mongoose, { Schema, model, Types } from 'mongoose';
import { parseObject, TParseOnError } from 'jet-validators/utils';
import { isString } from 'jet-validators';
import { isRelationalKey, transIsDate } from '@src/common/util/validators';
import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;

/******************************************************************************/
/* Types                                                                      */
/******************************************************************************/
export interface IUtilisateur {
  _id?: Types.ObjectId | number;
  id: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
  telephone?: string;
  statut: string;
  derniereConnexion?: Date;
}

export interface IUtilisateurLogin {
  email: string;
  motDePasse: string;
}

/******************************************************************************/
/* Parsers                                                                    */
/******************************************************************************/

const parseUtilisateur = parseObject<IUtilisateur>({
  id: isString,
  nom: isString,
  prenom: isString,
  email: isString,
  motDePasse: isString,
  role: isString,
  telephone: isString,
  statut: isString,
  derniereConnexion: transIsDate,
  _id: isRelationalKey,
});

const parseUserLogin = parseObject<IUtilisateurLogin>({
  email: isString,
  motDePasse: isString,
});

/******************************************************************************/
/* Schemas                                                                    */
/******************************************************************************/

const UtilisateurSchema = new Schema<IUtilisateur>({
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
    const hash = await bcrypt.hash(this.motDePasse, SALT_ROUNDS);
    this.motDePasse = hash;
    next();
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur lors du hachage du mot de passe:', err);
    next(new Error('Erreur de hachage du mot de passe.'));
  }
});

mongoose.pluralize(null);
export const Utilisateur = model<IUtilisateur>('Utilisateurs', UtilisateurSchema);

/*******************************************************************************/
/* Fonctions                                                                   */
/******************************************************************************/

const DEFAULT_UTILISATEUR_VALS = (): IUtilisateur => ({
  id: '',
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  role: 'Employé',
  statut: 'Actif',
});

export function __new__(user?: Partial<IUtilisateur>): IUtilisateur {
  const retVal = { ...DEFAULT_UTILISATEUR_VALS(), ...user };
  return parseUtilisateur(retVal, (errors) => {
    throw new Error('Échec de la création du nouvel utilisateur : ' + JSON.stringify(errors, null, 2));
  });
}

export function test(arg: unknown, errCb?: TParseOnError): arg is IUtilisateur {
  return !!parseUtilisateur(arg, errCb);
}

export function testlogin(arg: unknown, errCb?: TParseOnError): arg is IUtilisateurLogin {
  return !!parseUserLogin(arg, errCb);
}

export default {
  new: __new__,
  test,
  testlogin,
  Utilisateur,
} as const;