import JetonService from '@src/services/JetonService';
import Utilisateur from '@src/models/Utilisateur'; 
import { IReq, IRes } from './common/types';
import { parseReq } from './common/util';



/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  generatetoken: parseReq({ userLogin: Utilisateur.testlogin }), 
} as const;

/**
 * Générer un jeton.
 *
 * @param {IReq} req - La requête au serveur
 * @param {IRes} res - La réponse du serveur
 */
async function generateToken(req: IReq, res: IRes) {
  const { userLogin } = Validators.generatetoken(req.body);
  const token = await JetonService.generateToken(userLogin);

  if (token) {
    return res.status(200).send({ token: token });
  } else {

    return res.status(401).json({ error: 'Email ou mot de passe invalide.' });
  }
}



export default {
  generateToken,
} as const;