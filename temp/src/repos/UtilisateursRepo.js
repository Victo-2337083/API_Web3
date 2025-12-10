"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utilisateur_1 = require("@src/models/Utilisateur");
async function getAll() {
    try {
        const utilisateurs = await Utilisateur_1.Utilisateur.find().select('-motDePasse');
        return utilisateurs;
    }
    catch (err) {
        console.error('[Repo][getAll] Erreur :', err);
        throw new Error('Erreur lors de la récupération de tous les utilisateurs.');
    }
}
async function getOne(email) {
    try {
        const utilisateur = await Utilisateur_1.Utilisateur.findOne({ email: email }).select('-motDePasse');
        return utilisateur;
    }
    catch (err) {
        console.error(`[Repo][getOne] Erreur avec email ${email}:`, err);
        throw new Error("Erreur lors de la récupération de l'utilisateur.");
    }
}
async function getOneWithPassword(email) {
    try {
        const utilisateur = await Utilisateur_1.Utilisateur.findOne({ email: email });
        return utilisateur;
    }
    catch (err) {
        console.error(`[Repo][getOneWithPassword] Erreur avec email ${email}:`, err);
        throw new Error("Erreur lors de la récupération de l'utilisateur pour l'authentification.");
    }
}
async function add(utilisateur) {
    if (!utilisateur?.email || !utilisateur.motDePasse) {
        throw new Error("Les données de l'utilisateur sont invalides : l'email et le mot de passe sont obligatoires.");
    }
    try {
        const nouvelUtilisateur = new Utilisateur_1.Utilisateur(utilisateur);
        const saved = await nouvelUtilisateur.save();
        const savedObject = saved.toObject();
        delete savedObject.motDePasse;
        return savedObject;
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error("Impossible de mettre à jour l'utilisateur.");
    }
}
async function persists(email) {
    return (await Utilisateur_1.Utilisateur.findOne({ email })) !== null;
}
async function update(utilisateur) {
    if (!utilisateur?.email) {
        throw new Error("L'email de l'utilisateur est obligatoire pour la mise à jour.");
    }
    try {
        const updated = await Utilisateur_1.Utilisateur.findOneAndUpdate({ email: utilisateur.email }, { $set: utilisateur }, { new: true, runValidators: true }).select('-motDePasse');
        if (!updated) {
            throw new Error('Utilisateur non trouvé avec cet email.');
        }
        return updated;
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error("Impossible de mettre à jour l'utilisateur.");
    }
}
async function getByRole(role) {
    try {
        const utilisateurs = await Utilisateur_1.Utilisateur.find({ role: role }).select('-motDePasse');
        return utilisateurs;
    }
    catch (err) {
        console.error(`[Repo][getByRole] Erreur avec rôle ${role}:`, err);
        throw new Error('Erreur lors de la récupération des utilisateurs par rôle.');
    }
}
exports.default = {
    persists,
    getAll,
    getOne,
    getOneWithPassword,
    add,
    update,
    getByRole,
};
