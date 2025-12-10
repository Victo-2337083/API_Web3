
import { IUtilisateurLogin } from '@src/models/Utilisateur'; 
import UtilisateurRepo from '../repos/UtilisateursRepo'; 
import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';
import bcrypt from 'bcryptjs'; 

/**
 * Générer un jeton pour un utilisateur
 *
 * @param {IUtilisateurLogin} utilisateur - L'utilisateur demandant le jeton
 * @returns {Promise<string>} - Le jeton signé
 */
async function generateToken(utilisateur: IUtilisateurLogin): Promise<string> {
  // Recherche l'utilisateur par email AVEC le mot de passe haché
  //    On utilise getOneWithPassword du repo creeé précédemment
  const utilisateurBD = await UtilisateurRepo.getOneWithPassword(utilisateur.email);

  if (utilisateurBD) {
    //  Comparaison du mot de passe fourni avec le HACHAGE stocké
    //    motDePasse en BD est haché
    const isMatch = await bcrypt.compare(utilisateur.motDePasse, utilisateurBD.motDePasse);

    if (isMatch) {
      //  Le mot de passe correspond, on génère le jeton
      
      const payload = {
        id: utilisateurBD._id,
        email: utilisateurBD.email,
        role: utilisateurBD.role,
      };
      return jwt.sign(payload, ENV.Jwtsecret, { expiresIn: '24h' }); 
    }
  }
    
  // Si utilisateur non trouvé ou mot de passe invalide
  return '';
}


export default {
  generateToken,
} as const;