"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Base: '/api',
    GenerateToken: {
        Base: '/generatetoken',
        Get: '/',
    },
    // --- Factures  ---
    Factures: {
        Base: '/factures',
        Get: '/',
        GetByNumber: '/:numero',
        Add: '/',
        Update: '/',
    },
    Services: {
        Base: '/services',
        GetByService: '/:nomservice',
    },
    // ---  Bons de Commande ---
    BonsDeCommande: {
        Base: '/bonsdecommande',
        Get: '/',
        GetByNumber: '/:numero',
        Add: '/',
        Update: '/',
        GetByStatut: '/statut/:statut',
    },
    // ---  Fournisseurs ---
    Fournisseurs: {
        Base: '/fournisseurs',
        Get: '/',
        GetByName: '/:nom',
        Add: '/',
        Update: '/',
        GetByCategorie: '/categorie/:categorie',
    },
    // --- Utilisateurs ---
    Utilisateurs: {
        Base: '/utilisateurs',
        Get: '/',
        GetByEmail: '/:email',
        Add: '/',
        Update: '/',
        GetByRole: '/role/:role',
    },
};
