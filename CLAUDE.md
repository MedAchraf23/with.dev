# with.dev

Plateforme de recrutement IT (projet Master 2 MIAGE, UHA). Deux applications séparées : un
backend Spring Boot exposant une API REST, et un frontend React. L'authentification est
déléguée à Supabase Auth ; la base PostgreSQL est hébergée chez Supabase.

Périmètre actuel : **parcours candidat uniquement** (inscription, profil, recherche d'offres).
Le parcours recruteur n'existe qu'au niveau des entités JPA, sans service ni controller.

## Lancer le projet

**Tout l'applicatif, sans configuration** — le dépôt ne contient aucun secret :

```bash
docker compose up        # db + backend + frontend ; frontend sur http://localhost:5173
```

**En mode développement** — la base du compose suffit, le reste tourne sur la machine :

```bash
docker compose up -d db                    # PostgreSQL local sur le port 5432
cd backend && ./mvnw.cmd spring-boot:run   # port 8081, préfixe /api
cd frontend && npm run dev                 # port 5173
```

Les deux modes occupent le port 5173 : c'est l'un ou l'autre, jamais les deux.

Swagger : `http://localhost:8081/api/swagger-ui.html`

## Tests

```bash
cd backend && ./mvnw.cmd test       # 70 tests — JUnit, Mockito, Instancio, AssertJ, base H2
cd frontend && npm test             # 193 tests — Vitest, Testing Library, happy-dom
cd frontend && npx tsc --noEmit     # vérification du typage
```

Ces mêmes commandes sont rejouées à chaque push par `.github/workflows/ci.yml`, qui publie
ensuite les deux images sur `ghcr.io` si tout est vert.

## Architecture

**Backend** — couches `api` / `domain` / `core` :

- `api/<feature>/` — controller, DTO en `record`, mapper MapStruct. Les entités JPA ne sont
  jamais exposées directement.
- `domain/<feature>/` — entités, repositories Spring Data, services portant les règles métier.
- `core/` — configuration, sécurité, gestion des exceptions, jeu de données de démonstration.

Les règles métier appartiennent aux services, pas aux repositories ni aux controllers. Exemple :
« seules les offres publiées sont visibles » est appliqué par `JobOfferService`, le repository
recevant le statut en paramètre.

**Frontend** — découpage par feature :

- `features/<feature>/` — `interfaces/`, `services/`, `hooks/`, `components/`
- `presentation/` — `pages/`, `layouts/`, `guards/`, composants partagés
- `infrastructure/` — clients API, routeur, validateurs
- `types/common.type.ts` — vocabulaire partagé entre features. Une feature ne doit jamais
  importer depuis une autre feature.

## Conventions

- **Backend** : DTO en `record`, Lombok avec `@RequiredArgsConstructor`, erreurs métier via
  `ResourceNotFoundException` / `BadRequestException` (converties en réponses HTTP par
  `GlobalExceptionHandler`).
- **Frontend** : services en objet littéral exporté par défaut, types de retour explicites
  partout, imports via l'alias `@/`.
- **Tests backend** : `methode_quandCondition_alorsResultat` avec `@DisplayName` en français.
- **Tests frontend** : `describe('X - Unit')`, `it('should ...')` en anglais.

## Pièges connus

- **Les tests tournent sur H2, l'application sur PostgreSQL.** Des tests verts ne garantissent
  pas qu'une requête SQL fonctionne en réel : `LOWER()` appliqué à un paramètre null non typé
  passe sur H2 et échoue sur PostgreSQL. Pour valider une requête, écrire un test temporaire
  **sans** `@ActiveProfiles("test")` — il tape alors la vraie base.
- **`application.properties` est versionné et ne doit jamais contenir de secret** : chaque valeur
  dépendant de l'environnement est lue via `${VARIABLE:défaut}`, les défauts visant le PostgreSQL
  local du compose. Les variables d'environnement étant prioritaires sur le fichier, c'est le
  compose qui injecte `DB_URL=jdbc:postgresql://db:5432/withdev`.
- **`PATCH /candidates/me` rejette les chaînes vides** (`@Size(min = 1)` sur chaque champ texte).
  Le frontend doit omettre les champs laissés vides, jamais les envoyer à vide.
- **Les formulaires contenant des champs `isRequired` doivent porter `noValidate`** : sinon la
  validation native du navigateur bloque la soumission avant tout code JavaScript, sans afficher
  de message exploitable.
- **`Element.animate` est neutralisé dans `vitest.setup.ts`** : happy-dom l'implémente, et
  Framer Motion emprunte alors un chemin d'animation qui laisse des promesses rejetées au
  démontage des composants.
- **Le conteneur frontend doit être publié sur le port 5173**, et pas un autre : c'est la seule
  origine autorisée par `CorsConfig`, et celle que Supabase Auth attend pour le lien de
  confirmation d'e-mail (`signUp` ne passe pas d'`emailRedirectTo`) comme pour la redirection
  Google (construite depuis `window.location.origin`). Changer ce port oblige à toucher au CORS
  **et** au tableau de bord Supabase.
- **`VITE_API_URL` vaut `http://localhost:8081/api` dans le compose, jamais `http://backend:8081`** :
  le code s'exécute dans le navigateur, qui n'est pas sur le réseau Docker et ne résout pas le nom
  des services.
- **Les variables `VITE_*` passent par `args:` et non `environment:`** : Vite les remplace
  textuellement à la compilation, elles sont inscrites en dur dans le bundle. Une variable
  d'exécution n'aurait aucun effet.
- **`frontend/.dockerignore` doit exclure `node_modules`** : installé sous Windows, il contient des
  binaires de plateforme qui cassent npm dans l'image Linux.
- **Docker signale `SecretsUsedInArgOrEnv` sur `VITE_SUPABASE_ANON_KEY`** : faux positif dû au mot
  « KEY » dans le nom. Une clé `publishable` est publique par conception.
- **Un backend lancé sur la machine bloque `docker compose up`** : conflit sur le port 8081. Même
  chose pour `npm run dev` et le port 5173.
- **`frontend/.env.test` est versionné et nécessaire aux tests** : sans lui, `npm test` ne passe
  que sur une machine possédant un `.env`. Trois assertions de `backend.api.test.ts` comparent
  l'URL appelée à `http://localhost:8081/api`, et `supabase.api.ts` lève une exception dès son
  import quand `VITE_SUPABASE_*` sont vides — ce qui fait échouer cinq fichiers de tests, dont
  ceux qui n'utilisent Supabase qu'indirectement via `backend.api`. Vite charge ce fichier en
  mode test et le fait primer sur `.env`.
- **`ghcr.io` refuse les majuscules dans un nom d'image**, alors que le dépôt s'appelle
  `MedAchraf23/with.dev`. Le workflow convertit `GITHUB_REPOSITORY` en minuscules ; sans cela, le
  push échoue sur `invalid reference format`.
- **Les paquets GHCR héritent de la visibilité du dépôt** quand ils sont publiés par un workflow :
  le dépôt étant public, les deux images le sont aussi et un `docker pull` anonyme fonctionne, sans
  réglage à faire. Si le dépôt passait en privé, les paquets suivraient. Le seul test fiable est
  une requête anonyme au registre (`https://ghcr.io/token?scope=repository:<dépôt>/<image>:pull`
  puis lecture du manifeste), l'interface n'étant pas explicite là-dessus.
- **L'historique git contient le mot de passe d'un ancien projet Supabase** (`zpcafhjuotmpncrzihkq`,
  commits antérieurs à `ccd691e`). À supprimer ou faire tourner avant de rendre le dépôt public.

## Suivi du travail

Le découpage en tickets et leur avancement sont dans [docs/TICKETS.md](docs/TICKETS.md).

## Processus de travail

À appliquer systématiquement, sans attendre qu'on le demande.

**Avant d'écrire du code** — étudier le code existant le plus proche de ce qui va être produit
et s'en inspirer : mêmes couches, mêmes conventions de nommage, même style de tests. Devant un
doute d'architecture, analyser l'existant plutôt que de trancher seul.

**Pendant** — expliquer les décisions non évidentes au fil de l'eau, et signaler les écarts
assumés par rapport aux conventions. Un correctif de bug ne s'accompagne pas d'un nettoyage
alentour ; une opération ponctuelle n'a pas besoin d'une abstraction.

**Tests** — toute nouvelle fonctionnalité est couverte au même niveau que l'existant pour la
partie concernée : service, hook, composant, page côté frontend ; service et controller côté
backend.

**Avant de proposer un commit** — lancer les tests concernés, la vérification du typage
TypeScript si le frontend est touché, et le build en cas de doute.

**À la fin d'un ticket** — mettre à jour `docs/TICKETS.md`, et ajouter à la section « Pièges
connus » ci-dessus tout problème non évident rencontré, c'est-à-dire tout ce qui a coûté du
temps et qui ne se déduit pas de la lecture du code.

**Commits** — un commit par ticket, titre au format `Ticket N : <titre>`, corps expliquant le
pourquoi des décisions et pas seulement le quoi. Ne jamais commiter sans validation explicite.

**Format d'un nouveau ticket** — un objectif en une phrase, les fichiers ou couches concernés,
les règles métier à respecter, et ce qui devra être testable manuellement une fois terminé.
