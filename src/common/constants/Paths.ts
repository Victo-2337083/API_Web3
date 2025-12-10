export default {
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
  // --- Utilisateurs ---
  Utilisateurs: {
    Base: '/utilisateurs',
    Get: '/',
    GetByEmail: '/:email',
    Add: '/',
    Update: '/',
    GetByRole: '/role/:role', 
  },
} as const;