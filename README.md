# SIG - Plateforme de Patrimoine (Frontend)


L'application est développée avec Angular et utilise Leaflet pour la cartographie.

## Choix Techniques 
Pour le frontend, nous avons choisi Angular car il permet d’avoir une application bien structurée et intègre tous les outils pour la création d’applications web modernes. Il propose déjà un ensemble cohérent de bibliothèques, de standards et d’outils, ce qui évite de multiplier les dépendances externes.

En ce qui concerne la carte, Leaflet et OpenStreetMap représente un choix logique. Ils sont gratuits, open source et offrent pas mal de fonctionnalités pour répondre aux besoins du projet.


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
