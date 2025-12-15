# API de Gestion de Factures

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

API RESTful pour la gestion de factures, utilisateurs et services avec authentification JWT et documentation OpenAPI.

# URL en production d'api: https://api-web3-2ww0.onrender.com
## Résumé

# exemple d utiisateur pret pour se connecter au systeme
    "email": "ecomptable@api.com",
    "motDePasse": "ComptaPass123"

API 
Application de Gestion de Factures
Présentation générale

Ce projet comprend une API REST sécurisée et une application cliente permettant la gestion complète de factures commerciales (création, consultation, modification et suppression), avec gestion des utilisateurs et authentification JWT.

L’API est développée avec Node.js, TypeScript, et utilise une base de donnée MongoDB pour la persistance des données. la documentation utilise la norme openAPI avec swgger.
# Liens importants

URL de l’API en production :
# https://api-web3-2ww0.onrender.com

Documentation Swagger production :
# https://api-web3-2ww0.onrender.com/api/api-docs

Dépôt GitHub :
# https://github.com/Victo-2337083/API_Web3

# Description sommaire de l’application

L’application permet à un utilisateur authentifié (Admin, Comptable ou Employé) de :

gérer des factures commerciales ;

calculer automatiquement les montants HT, TVA et TTC ;

consulter les factures par numéro ou par statut ;

gérer les utilisateurs et leurs rôles ;

sécuriser l’accès aux fonctionnalités via JWT.

# Technologies utilisées

Runtime : Node.js

Langage : TypeScript

Base de données : MongoDB 
ODM : Mongoose
Authentification : JWT
Sécurité : bcryptjs, CORS, Helmet
Documentation : Swagger 
# Architecture du projet
Architecture en couches :

Routes : gestion des requêtes HTTP

Services : logique métier

Repositories : accès aux données

Models : schémas et validations MongoDB

# Procédure d’installation de l’API
Cloner le dépôt
git clone https://github.com/Victo-2337083/API_Web3.git
cd API_Web3

# Installer les dépendances
npm install

# Configuration des variables d’environnement
créer un fichier .env
NODE_ENV=development
PORT=3000
HOST=localhost
MONGODB=mongodb://localhost:27017/Projet_API_Facture
JWTSECRET=votre_secret_jwt_securise
FRONTEND_URL=http://localhost:3000

# Vérification et démarrage
npm run build
npm run dev

# L’API est accessible à l’adresse :
http://localhost:3000
# Procédure de création de la base de données
Installer MongoDB

Lancer le service MongoDB

Configurer l’URI dans le fichier .env

Démarrer l’API

# MongoDB Atlas
Créer un compte MongoDB Atlas

Créer un cluster plan gratuit

Autoriser l’accès réseau IP

Créer un utilisateur de base de données

Copier l’URI de connexion

Mettre à jour la variable MONGODB dans .env

# Informations d’authentification
Création d’un utilisateur

POST /api/utilisateurs
{
"utilisateur": {
"id": "usr_001",
"nom": "Dupont",
"prenom": "Jean",
"email": "jean.dupont@example.com",
"motDePasse": "MotDePasse@123",
"role": "Comptable"
}
}
# Génération d’un token JWT
{
"userLogin": {
"email": "jean.dupont@example.com",
"motDePasse": "MotDePasse@123"
}
}

# Utilisation du token

Ajouter le header suivant aux requêtes protégées :

# Documentation API

Swagger local : http://localhost:3000/api/api-docs

Swagger production : https://api-web3-2ww0.onrender.com/api/api-docs