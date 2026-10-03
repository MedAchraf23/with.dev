# with.dev

Plateforme de recrutement IT (projet Master 2 MIAGE, UHA). Deux applications séparées : un
backend Spring Boot exposant une API REST, et un frontend React. L'authentification est
déléguée à Supabase Auth ; la base PostgreSQL est hébergée chez Supabase.

Périmètre actuel : **parcours candidat uniquement** (inscription, profil, recherche d'offres).
Le parcours recruteur n'existe qu'au niveau des entités JPA, sans service ni controller.

## Lancer le projet

```bash
cd backend && ./mvnw.cmd spring-boot:run   # port 8081, préfixe /api
cd frontend && npm run dev                 # port 5173
```

Swagger : `http://localhost:8081/api/swagger-ui.html`

## Tests

```bash
cd backend && ./mvnw.cmd test       # 70 tests — JUnit, Mockito, Instancio, AssertJ, base H2
cd frontend && npm test             # 193 tests — Vitest, Testing Library, happy-dom
cd frontend && npx tsc --noEmit     # vérification du typage
```

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
- **`backend/src/main/resources/application.properties` n'est pas versionné** : il contient le
  mot de passe de la base. Un dépôt fraîchement cloné ne peut donc pas démarrer le backend.
  Le modèle se trouve dans `application.properties.example`.
- **`PATCH /candidates/me` rejette les chaînes vides** (`@Size(min = 1)` sur chaque champ texte).
  Le frontend doit omettre les champs laissés vides, jamais les envoyer à vide.
- **Les formulaires contenant des champs `isRequired` doivent porter `noValidate`** : sinon la
  validation native du navigateur bloque la soumission avant tout code JavaScript, sans afficher
  de message exploitable.
- **`Element.animate` est neutralisé dans `vitest.setup.ts`** : happy-dom l'implémente, et
  Framer Motion emprunte alors un chemin d'animation qui laisse des promesses rejetées au
  démontage des composants.
- **Le `Makefile` à la racine référence un `docker-compose.yml` inexistant** : toutes ses cibles
  échouent en l'état.

## Suivi du travail

Le découpage en tickets et leur avancement sont dans [docs/TICKETS.md](docs/TICKETS.md).
