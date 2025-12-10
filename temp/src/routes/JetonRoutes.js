"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JetonService_1 = __importDefault(require("@src/services/JetonService"));
const Utilisateur_1 = __importDefault(require("@src/models/Utilisateur"));
const util_1 = require("./common/util");
const Validators = {
    generatetoken: (0, util_1.parseReq)({ userLogin: Utilisateur_1.default.testlogin }),
};
async function generateToken(req, res) {
    const { userLogin } = Validators.generatetoken(req.body);
    const token = await JetonService_1.default.generateToken(userLogin);
    if (token) {
        return res.status(200).send({ token: token });
    }
    else {
        return res.status(401).json({ error: 'Email ou mot de passe invalide.' });
    }
}
exports.default = {
    generateToken,
};
