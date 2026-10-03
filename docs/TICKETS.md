# Tickets

Objectif : une application minimaliste mais présentable, couvrant le parcours candidat
(inscription, consultation et recherche d'offres, profil), destinée à être montrée à des
recruteurs.

Le ticket #7 marque l'atteinte de cet objectif : le parcours est utilisable de bout en bout.

---

## Terminés

### #1 — Provisionnement automatique de l'utilisateur applicatif · `ad49044`

Création de la ligne `users` à la première requête authentifiée, à partir des informations du
jeton Supabase. Recherche par UUID plutôt que par email, et correction du rôle `null` qui
faisait échouer toute requête authentifiée — ce qui rendait la création de profil impossible.

### #2 — API de consultation des offres · `ad49044`

`GET /job-offers` (recherche par titre, filtres ville / type de contrat / mode de travail) et
`GET /job-offers/{id}`. Seules les offres publiées sont exposées. L'entreprise est chargée dans
la même requête pour éviter le N+1.

### #3 — Jeu de données de démonstration · `ad49044`

`DevDataSeeder` insère 4 entreprises, 2 recruteurs et 11 offres au démarrage, uniquement sur le
profil `dev` et seulement si la base est vide. Une offre est volontairement en brouillon : elle
ne doit jamais apparaître côté candidat.

### #4 — Client HTTP du frontend vers l'API · `b7c0a5e`

`backend.api.ts` : jeton Supabase posé automatiquement en en-tête, réponses en échec converties
en `ApiError` typées portant le code HTTP et le message du backend, critères vides omis de l'URL.

### #5 — Page de recherche des offres · `c377329`

Feature `offres` complète (types, service, hook, composants) et page `/offres`. Recherche au
clic, filtres appliqués immédiatement, quatre états traités explicitement (chargement, erreur,
aucun résultat, résultats).

### #6 — Page profil candidat · `04c73e4`

Feature `candidat` complète et page `/profil`. Un seul écran couvre la création (`POST`, qui
attribue aussi le rôle `CANDIDATE`) et la mise à jour (`PATCH`). Les champs vides sont omis de
la requête. Déplacement de `ContractType` et `WorkMode` dans `types/common.type.ts` pour éviter
une dépendance entre features.

### #7 — Navigation et mise en page · `02a8ad0`

Barre de navigation (marque, liens Offres / Mon profil avec page courante, déconnexion),
activation de `MainLayout` qui n'était branché nulle part, suppression du talon `Dashboard` au
profit d'une redirection vers `/offres`, et redirection de la racine.

### #9 — Réparation de la suite de tests frontend · `bbbd719`

Aucun test ne démarrait : jsdom 28 charge en CommonJS des paquets désormais publiés en ESM.
Remplacé par happy-dom, et neutralisation de l'API Web Animations dans la configuration de test.

---

## À faire

### #8 — Empaquetage et mise en valeur du projet

Objectif : qu'un recruteur puisse comprendre et lancer le projet sans effort. Par ordre
d'impact décroissant :

1. **README** — ce que fait le projet, captures d'écran, stack, architecture, comment le lancer,
   décisions techniques notables, et la part de contribution personnelle (le dépôt contient des
   contributions d'autres membres de l'équipe).
2. **`docker compose up`** — frontend, backend et un PostgreSQL conteneurisé, de sorte que le
   projet tourne sur n'importe quelle machine sans configuration ni secret.
   Prérequis : externaliser `application.properties` en variables d'environnement avec des
   valeurs par défaut, et versionner un fichier sans aucun secret.
   L'authentification continue de passer par le Supabase cloud, qui ne demande que des valeurs
   publiques (clé `publishable` et URL JWKS). Le mot de passe de la base est le seul vrai secret
   du système, et il disparaît grâce au PostgreSQL local.
   Le seeder peuplant automatiquement une base vide, l'application démarre avec ses offres.
3. **CI GitHub Actions** — exécution des tests à chaque push, badge dans le README.
4. **Déploiement en ligne** (optionnel) — frontend sur Vercel, backend sur Render ou Railway.
   Attention : les offres gratuites mettent le serveur en veille, prévenir du délai de réveil.

---

## Dettes connues, non bloquantes

- **Aucun endpoint n'est restreint par rôle** (`@PreAuthorize` absent du code de production).
  Le mécanisme est câblé et testé, mais inutile tant que seul le parcours candidat existe.
- **Les tests backend tournent sur H2 alors que la production utilise PostgreSQL** — voir les
  pièges connus dans `CLAUDE.md`. Des Testcontainers supprimeraient cet écart.
- **Le `Makefile` référence un `docker-compose.yml` inexistant** — à traiter avec le ticket #8.
- **`READ_ME.md` fait doublon** avec `README.md` et ne contient qu'un renvoi.
- **Pas de TJM ni de photo** dans le formulaire de profil, alors que les colonnes existent en
  base — choix volontaire pour limiter la taille du formulaire.
