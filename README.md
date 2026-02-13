# SIG - Plateforme de Patrimoine (Frontend)


L'application est développée avec Angular et utilise Leaflet pour la cartographie.

## Installation

Suivre ces étapes pour configurer et lancer le projet localement.

### 1. Prérequis

Composants nécessaires :

- Node.js (version 18 ou supérieure recommandée)
- npm
- Angular CLI (optionnel : `npm install -g @angular/cli`)

### 2. Installation des dépendances

À la racine du dossier `sig-frontend`, exécuter la commande suivante :

```bash
npm install
```
Elle permettra de télécharger les dépendances du projet.

### 3. Lancement de l'application

Démarrer le serveur de développement :

```bash
npm start
```

Alternative avec Angular CLI :

```bash
ng serve
```

L'application est accessible sur : http://localhost:4200

## Structure du projet

- `src/app/core` : Services API et interfaces 
- `src/app/features` : Modules fonctionnels (ex: `sites-explorer`).
- `src/app/shared` : Composants réutilisables.

## Intégration Backend

Cette application nécessite l'API sig-backend pour fonctionner. S'assurer que le service backend est lancé sur le port local (par défaut : http://localhost:8000).
