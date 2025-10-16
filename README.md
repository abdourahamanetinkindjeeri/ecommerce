# EnsetApp - Plateforme E-commerce

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.

## Vue d'ensemble

EnsetApp est une plateforme e-commerce moderne développée avec Angular, offrant un système complet de gestion des produits avec fonctionnalité VIP pour les gestionnaires.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- [Angular CLI](https://angular.dev/tools/cli) : `npm install -g @angular/cli`

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-depot>
   cd enset-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Démarrage

Pour démarrer un serveur de développement local, exécutez :

```bash
ng serve
```

Une fois le serveur en cours d'exécution, ouvrez votre navigateur et naviguez vers `http://localhost:4200/`. L'application se rechargera automatiquement à chaque modification des fichiers source.

## Intégration API

Le frontend communique avec une API backend Node.js/Express fonctionnant sur `http://localhost:5173`. Assurez-vous que le backend fonctionne avant de démarrer le serveur de développement Angular.

## Fonctionnalités

### Gestion des Utilisateurs
- Authentification et autorisation des utilisateurs
- Contrôle d'accès basé sur les rôles (VENDEUR, GESTIONNAIRE, VISITEUR)
- Fonctionnalités de connexion/déconnexion sécurisées

### Gestion des Produits
- Création de produits avec téléchargement d'images
- Workflow d'approbation des produits
- **Fonctionnalité VIP des Produits** : Les gestionnaires peuvent marquer les produits approuvés comme VIP
  - Les produits VIP sont prioritaires dans les listes
  - Indicateurs visuels spéciaux (icône ⭐) sur la page d'accueil
  - Interface de gestion dédiée pour les gestionnaires

### Tableau de Bord
- Tableaux de bord spécifiques aux rôles
- Interface d'approbation des produits pour les gestionnaires
- Gestion des produits VIP

## Génération de code

Angular CLI inclut de puissants outils de génération de code. Pour générer un nouveau composant, exécutez :

```bash
ng generate component nom-composant
```

Pour une liste complète des schémas disponibles (tels que `components`, `directives`, ou `pipes`), exécutez :

```bash
ng generate --help
```

## Construction

Pour construire le projet, exécutez :

```bash
ng build
```

Cela compilera votre projet et stockera les artefacts de construction dans le répertoire `dist/`. Par défaut, la construction de production optimise votre application pour les performances et la vitesse.

## Tests unitaires

Pour exécuter les tests unitaires avec [Karma](https://karma-runner.github.io), utilisez la commande suivante :

```bash
ng test
```

## Tests de bout en bout

Pour les tests de bout en bout (e2e), exécutez :

```bash
ng e2e
```

Angular CLI n'est pas livré avec un framework de test de bout en bout par défaut. Vous pouvez choisir celui qui convient à vos besoins.

## Détails de la Fonctionnalité VIP

- **Accès Gestionnaire** : Seuls les utilisateurs avec le rôle GESTIONNAIRE peuvent basculer le statut VIP
- **Indicateurs Visuels** : Les produits VIP affichent une icône d'étoile (⭐) sur le badge de prix
- **Priorisation** : Les produits VIP apparaissent en premier dans les listes de produits
- **Interface de Gestion** : Page dédiée "Gérer les Produits VIP" pour que les gestionnaires basculent le statut VIP sur les produits approuvés

## Ressources Supplémentaires

Pour plus d'informations sur l'utilisation d'Angular CLI, y compris les références de commandes détaillées, visitez la page [Vue d'ensemble et Référence des Commandes Angular CLI](https://angular.dev/tools/cli).
