# with.dev

[![CI](https://github.com/MedAchraf23/with.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/MedAchraf23/with.dev/actions/workflows/ci.yml)

Plateforme de recrutement IT : un candidat s'inscrit, complète son profil, recherche des offres
et les consulte. Le projet réunit une API REST Spring Boot et une application React, et se lance
d'une seule commande.

Réalisé dans le cadre du Master 2 MIAGE de l'Université de Haute-Alsace.

```bash
git clone https://github.com/MedAchraf23/with.dev.git
cd with.dev
docker compose up
```

L'application est alors sur **http://localhost:5173**. Aucune configuration, aucune clé à
fournir : le dépôt ne contient aucun secret, et les valeurs par défaut suffisent.

---

## Aperçu

<!--
Captures à déposer dans docs/images/, puis décommenter les trois lignes ci-dessous :
  connexion.png  — la page de connexion
  offres.png     — la liste des offres, avec des filtres appliqués
  profil.png     — le formulaire de profil candidat, rempli
-->

<!-- ![Page de connexion](docs/images/connexion.png) -->
<!-- ![Recherche d'offres](docs/images/offres.png) -->
<!-- ![Profil candidat](docs/images/profil.png) -->

---

## Ce que fait l'application

- **Inscription et connexion** par e-mail avec confirmation d'adresse, ou via Google.
- **Profil candidat** : un seul écran couvre la création et la mise à jour.
- **Recherche d'offres** : recherche par intitulé, filtres par ville, type de contrat et mode de
  travail. Seules les offres publiées sont exposées — une offre en brouillon du jeu de données de
  démonstration ne doit jamais apparaître, et sert de garde-fou.
- **Jeu de données de démonstration** inséré au démarrage : 4 entreprises, 11 offres. Rien à
  saisir pour voir l'application vivante.

**Périmètre assumé** — seul le parcours candidat est implémenté. Il n'y a volontairement pas
d'espace recruteur : personne ne publie d'offre depuis l'application, les offres proviennent du
jeu de données. Ce choix est documenté, pas subi ; voir *[Limites](#limites-assumées)*.

---

## Démarrage

### Tout l'applicatif, sans rien installer

```bash
docker compose up
```

Trois conteneurs démarrent : PostgreSQL, l'API et le frontend servi par nginx. Le frontend doit
rester publié sur le port **5173** — c'est la seule origine acceptée par la configuration CORS, et
celle qu'attend Supabase pour ses redirections.

### En mode développement

La base du compose suffit, le reste tourne sur la machine :

```bash
docker compose up -d db                    # PostgreSQL sur le port 5432
cd backend && ./mvnw spring-boot:run       # API sur le port 8081, préfixe /api
cd frontend && npm install && npm run dev  # interface sur le port 5173
```

Sous Windows, utiliser `.\mvnw.cmd` à la place de `./mvnw`.

### Documentation de l'API

Swagger UI : **http://localhost:8081/api/swagger-ui.html**

| Méthode | Route | Rôle |
|---|---|---|
| `GET` | `/job-offers` | liste des offres publiées, avec recherche et filtres |
| `GET` | `/job-offers/{id}` | détail d'une offre |
| `POST` | `/candidates` | création du profil candidat |
| `GET` | `/candidates/me` | profil du candidat connecté |
| `PATCH` | `/candidates/me` | mise à jour partielle du profil |
| `DELETE` | `/candidates/me` | suppression du profil |
| `GET` | `/users/me` | compte de l'utilisateur connecté |
| `PATCH` | `/users/archive` · `/users/unarchive` | archivage et désarchivage du compte |

---

## Stack technique

| | |
|---|---|
| **Backend** | Java 21, Spring Boot 4.0.3, Spring Web, Spring Security (OAuth2 Resource Server), Spring Data JPA, PostgreSQL, MapStruct, Lombok, springdoc OpenAPI |
| **Frontend** | React 18, TypeScript, Vite, React Router 7, HeroUI, Tailwind CSS 4, Supabase JS |
| **Tests** | JUnit 5, Mockito, AssertJ, Instancio, H2 · Vitest, Testing Library, happy-dom |
| **Infrastructure** | Docker (images multi-étapes), Docker Compose, GitHub Actions, GitHub Container Registry |

---

## Architecture

```text
.
├── .github/workflows/ci.yml       # intégration continue et publication des images
├── backend/
│   └── src/main/java/uha/miage/backend/
│       ├── api/<feature>/         # controllers, DTO en record, mappers MapStruct
│       ├── domain/<feature>/      # entités, repositories, services
│       └── core/                  # configuration, sécurité, exceptions, jeu de données
├── frontend/
│   └── src/
│       ├── features/<feature>/    # interfaces, services, hooks, composants
│       ├── presentation/          # pages, layouts, guards
│       └── infrastructure/        # clients API, routeur, validateurs
├── docs/TICKETS.md                # découpage du travail et avancement
└── docker-compose.yml
```

**Backend — trois couches.** Les entités JPA ne sont jamais exposées : chaque réponse passe par un
DTO en `record`, construit par un mapper MapStruct. Les règles métier appartiennent aux services,
jamais aux repositories ni aux controllers. Exemple : « seules les offres publiées sont visibles »
est appliqué par `JobOfferService`, le repository recevant le statut en paramètre — la règle reste
donc lisible à un seul endroit.

**Frontend — découpage par feature.** Chaque feature (`authentification`, `candidat`, `offres`)
possède ses propres types, services, hooks et composants. **Une feature n'importe jamais depuis une
autre** : le vocabulaire partagé est remonté dans `types/common.type.ts`. Cette contrainte évite le
couplage transversal qui rend un frontend impossible à découper plus tard.

---

## Décisions techniques

**L'authentification est déléguée à Supabase.** Le backend est un simple *resource server* : il
valide le jeton JWT et n'implémente aucune gestion de mot de passe. L'utilisateur applicatif est
provisionné à la première requête authentifiée, à partir des informations du jeton — la recherche
se fait par UUID et non par e-mail, pour qu'un changement d'adresse ne casse pas le lien.

**Le dépôt ne contient aucun secret, et c'est une contrainte de conception.**
`application.properties` est versionné : chaque valeur dépendant de l'environnement y est lue via
`${VARIABLE:défaut}`, les défauts visant le PostgreSQL local. La base du compose est volontairement
une base **locale** et non la base Supabase, car s'y connecter exigerait de publier son mot de
passe — le seul vrai secret du système. L'authentification continue de passer par le Supabase
cloud, qui ne demande que des valeurs publiques. Conséquence directe : n'importe qui peut cloner et
lancer le projet.

**Les images Docker sont construites en multi-étapes.** L'image backend ne contient que le JRE et
le `.jar` — ni Maven, ni le JDK, ni les sources. L'image frontend ne contient que nginx et les
fichiers statiques. Les variables `VITE_*` passent par des arguments de build et non par des
variables d'exécution, Vite les figeant à la compilation.

**L'intégration continue publie les images.** À chaque push, deux travaux parallèles compilent et
testent les deux applications. Les images sont ensuite **construites sur toutes les branches** —
construire est une vérification au même titre qu'un test — mais **publiées depuis `main`
seulement**, taguées avec le SHA du commit et `latest`, de sorte que `latest` ne désigne que du
code testé. Elles sont publiques sur
[GitHub Container Registry](https://github.com/MedAchraf23?tab=packages).

---

## Tests

```bash
cd backend && ./mvnw test      #  70 tests
cd frontend && npm test        # 193 tests
cd frontend && npx tsc --noEmit
```

Ces mêmes commandes sont rejouées à chaque push par l'intégration continue, sur une machine vierge
et sans configuration — l'état du badge en haut de cette page en est le résultat.

---

## Répartition du travail

Le dépôt couvre deux phases distinctes.

**Février – mars 2026 · projet d'équipe à quatre étudiants** — Arthur M., David Y., Reda D. et
moi-même. Ma contribution : la gestion du compte utilisateur côté backend (`GET /users/me`, mise à
jour, suppression, puis archivage et désarchivage), avec les tests de service et de controller
correspondants.

**Septembre – octobre 2026 · reprise individuelle** — l'intégralité de ce qui est visible
aujourd'hui : l'API de consultation des offres et le jeu de données de démonstration, le client
HTTP du frontend, la page de recherche, la page de profil, la navigation et la mise en page, la
réparation de la suite de tests frontend, la conteneurisation complète, et la chaîne
d'intégration continue.

Le découpage en tickets et leur avancement sont suivis dans [docs/TICKETS.md](docs/TICKETS.md).

---

## Limites assumées

Énoncées ici plutôt que laissées à découvrir :

- **Pas d'espace recruteur.** Les entités JPA existent, mais aucun service ni controller : une
  candidature n'aurait aujourd'hui pas de destinataire.
- **Les tests tournent sur H2 alors que l'application tourne sur PostgreSQL.** Des tests verts ne
  garantissent donc pas qu'une requête SQL passe en réel. Des Testcontainers supprimeraient cet
  écart, au prix d'un service PostgreSQL dans la CI.
- **Aucun outil de migration de schéma** : c'est `ddl-auto=update` qui crée les tables. Suffisant
  pour une base de démonstration recréée à volonté, inadapté à une production où un schéma existant
  doit évoluer sans perte. Flyway serait le choix correct.
- **Aucun endpoint n'est restreint par rôle.** Le mécanisme est câblé et testé, mais `@PreAuthorize`
  reste absent du code de production tant que seul le parcours candidat existe.
- **Pas encore de déploiement en ligne.** Les images publiées sont prêtes ; il reste à ouvrir le
  CORS sur l'origine déployée et à rendre relative l'URL de l'API, aujourd'hui figée dans le bundle
  à la compilation.

---

## Licence

Projet développé à des fins pédagogiques dans le cadre du Master 2 MIAGE de l'Université de
Haute-Alsace.
