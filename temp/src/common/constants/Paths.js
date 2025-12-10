"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Base: '/api',
    GenerateToken: {
        Base: '/generatetoken',
        Get: '/',
    },
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
    Utilisateurs: {
        Base: '/utilisateurs',
        Get: '/',
        GetByEmail: '/:email',
        Add: '/',
        Update: '/',
        GetByRole: '/role/:role',
    },
};
