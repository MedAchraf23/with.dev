# with.dev

with.dev est une plateforme web de gestion du recrutement et des candidatures. Le projet est développé dans le cadre du Master 2 MIAGE de l'Université de Haute-Alsace.

Le dépôt contient une application React/TypeScript côté client et une API REST Spring Boot côté serveur.

## Fonctionnalités

- Authentification et confirmation d'adresse e-mail
- Gestion de session avec Supabase et jetons JWT
- Accès protégé au tableau de bord
- API REST documentée avec OpenAPI/Swagger
- Persistance des données avec PostgreSQL
- Tests d'intégration et tests de services côté backend

## Stack technique

### Frontend

- React 18 et TypeScript
- Vite
- React Router
- HeroUI et Tailwind CSS
- Supabase Auth
- Vitest et Testing Library

### Backend

- Java 21
- Spring Boot 4
- Spring Web, Spring Security et Spring Data JPA
- PostgreSQL
- MapStruct et Lombok
- OAuth2 Resource Server et JWT
- OpenAPI avec Springdoc
- JUnit, H2 et Spring Security Test

## Organisation du projet

```text
.
├── backend/                 # API Spring Boot
│   ├── src/main/            # Code source et configuration
│   └── src/test/            # Tests backend
├── frontend/                # Application React/Vite
│   ├── src/                 # Pages, composants et services
│   └── public/              # Ressources statiques et polices
├── Makefile                 # Commandes Docker disponibles
└── README.md
```

## Prérequis

- Git
- Java 21
- Node.js 20 ou une version LTS plus récente
- npm
- Une base PostgreSQL accessible par le backend
- Un projet Supabase configuré pour l'authentification JWT

Vérifier les versions installées :

```bash
java -version
node --version
npm --version
```

## Installation

Cloner le dépôt puis installer les dépendances du frontend :

```bash
git clone <url-du-depot>
cd with.dev
cd frontend
npm install
```

Le backend utilise le Maven Wrapper fourni dans le dépôt et ne nécessite donc pas une installation globale de Maven.

## Configuration du backend

La configuration se trouve dans `backend/src/main/resources/application.properties`. Elle définit notamment :

- le profil Spring actif ;
- la connexion PostgreSQL ;
- le contexte de l'API (`/api`) ;
- la configuration JWT Supabase ;
- les chemins OpenAPI et Swagger.

Les identifiants de base de données et les clés JWT ne doivent jamais être commités. Utiliser des variables d'environnement ou une configuration locale non suivie par Git pour les valeurs sensibles avant de lancer l'application.

Pour les tests, une base H2 en mémoire est utilisée automatiquement via `backend/src/test/resources/application-test.properties`.

## Lancer le projet

### Backend

Depuis le dossier `backend` :

Sous Windows :

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Sous Linux ou macOS :

```bash
cd backend
./mvnw spring-boot:run
```

L'API est alors accessible sur `http://localhost:8080/api`.

### Frontend

Dans un second terminal :

```bash
cd frontend
npm run dev
```

Vite affiche l'URL locale dans le terminal, généralement `http://localhost:5173`.

## Documentation de l'API

Lorsque le backend est lancé, les ressources suivantes sont disponibles :

- Swagger UI : `http://localhost:8080/api/swagger-ui.html`
- Spécification OpenAPI : `http://localhost:8080/api/api-docs`

## Tests et vérifications

### Backend

```powershell
cd backend
.\mvnw.cmd test
```

### Frontend

```bash
cd frontend
npm test
npm run build
```

## Commandes Docker

Le `Makefile` contient des raccourcis pour les services Docker si un fichier `docker-compose.yml` est disponible dans l'environnement :

```bash
make start    # démarrer les conteneurs
make stop     # arrêter les conteneurs
make restart  # redémarrer les conteneurs
make status   # afficher l'état des conteneurs
make logs     # afficher les logs
make clean    # supprimer les conteneurs et les volumes
```

## Contribution

1. Créer une branche dédiée à la fonctionnalité ou au correctif.
2. Ajouter ou mettre à jour les tests concernés.
3. Vérifier le build frontend et les tests backend.
4. Ouvrir une pull request avec une description concise des changements.

## Licence

Ce projet est développé à des fins pédagogiques dans le cadre du Master 2 MIAGE de l'Université de Haute-Alsace.