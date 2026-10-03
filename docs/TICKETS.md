# Tickets

Objectif : une application minimaliste mais présentable, couvrant le parcours candidat
(inscription, consultation et recherche d'offres, profil), destinée à être montrée à des
recruteurs.

**Périmètre assumé** : seul le parcours candidat est implémenté. Il n'y a volontairement pas
d'espace recruteur — personne ne publie d'offre ni ne traite de candidature depuis
l'application. Les offres proviennent du jeu de données de démonstration, et une candidature
est enregistrée et confirmée au candidat sans destinataire côté entreprise.

Le ticket #7 marque l'atteinte du parcours de bout en bout. Les tickets suivants portent sur
l'empaquetage du projet (#8, #10, #11, #12) et sur les manques fonctionnels encore visibles
à l'usage (#13, #14).

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

## Empaquetage du projet

### #8 — Conteneurisation

**Objectif** : `git clone` puis `docker compose up`, et l'application tourne sur n'importe quelle
machine, sans configuration ni secret à fournir.

**Prérequis bloquant** — `backend/src/main/resources/application.properties` n'est pas versionné
car il contient le mot de passe de la base. Un dépôt fraîchement cloné ne peut donc pas démarrer.
Il faut le remplacer par un fichier versionné **sans aucun secret**, où chaque valeur est lue
depuis une variable d'environnement avec une valeur par défaut adaptée au compose.

**Livrables**

- `backend/Dockerfile` — construction multi-étapes : compilation Maven puis image d'exécution
  ne contenant que le JRE et le fichier `.jar`.
- `frontend/Dockerfile` — construction multi-étapes : build Vite puis service des fichiers
  statiques. Les variables `VITE_*` étant figées à la compilation, elles passent par des
  arguments de build.
- `docker-compose.yml` — trois services : `db` (PostgreSQL avec volume), `backend`, `frontend`.
  Dépendances de démarrage et contrôle de santé sur la base.
- Mise à jour du `Makefile`, qui référence aujourd'hui un `docker-compose.yml` inexistant.

**Choix d'architecture retenu** — la base du compose est un PostgreSQL **local**, pas la base
Supabase : s'y connecter exigerait de publier le mot de passe de la base, le seul vrai secret du
système. L'authentification continue de passer par le Supabase cloud, qui ne demande que des
valeurs publiques (clé `publishable`, URL JWKS). Le seeder peuplant automatiquement une base
vide, l'application démarre avec ses offres.

**Testable manuellement** — sur un clone neuf, sans fichier de configuration : `docker compose up`
puis ouverture du frontend, inscription, consultation des offres déjà présentes.

### #10 — Intégration continue GitHub Actions

**Objectif** : chaque push déclenche la compilation et les tests des deux applications, avec un
résultat visible publiquement.

**Livrables**

- `.github/workflows/ci.yml` — deux travaux indépendants (backend et frontend) exécutés en
  parallèle, avec mise en cache des dépendances Maven et npm.
- Backend : `./mvnw test`. Frontend : `npm ci`, `npx tsc --noEmit`, `npm test`, `npm run build`.
- Badge d'état à placer dans le README au ticket #11.

**Point d'attention** — les tests backend tournent sur H2, donc aucun secret ni service externe
n'est nécessaire dans la CI. Si des Testcontainers étaient introduits plus tard, il faudrait un
service PostgreSQL dans le workflow.

### #11 — README

À écrire **après** #8 et #10, pour pouvoir y intégrer la commande unique de lancement et le badge
de la CI.

**Contenu** — ce que fait le projet, captures d'écran, stack, architecture expliquée, lancement
(via Docker et en mode développement), décisions techniques notables, et la part de contribution
personnelle, le dépôt contenant des contributions d'autres membres de l'équipe.

À traiter au passage : `READ_ME.md` fait doublon et ne contient qu'un renvoi.

### #12 — Déploiement en ligne *(optionnel)*

Frontend sur Vercel, backend sur Render ou Railway à partir du `Dockerfile` du ticket #8.
Ouverture du CORS sur l'origine déployée, aujourd'hui figé sur `http://localhost:5173`.

Les offres gratuites mettent le serveur en veille après inactivité : prévoir un délai de réveil
d'environ une minute, et le mentionner là où le lien est publié.

---

## Fonctionnalités restantes

### #13 — Page de détail d'une offre

**Le manque le plus visible à l'usage** : cliquer sur une offre ne produit rien aujourd'hui.
L'endpoint `GET /job-offers/{id}` existe déjà depuis le ticket #2 mais n'est utilisé par aucun
écran.

**Livrables** — route `/offres/:id`, page de détail (description complète, entreprise,
rémunération, lieu, mode de travail, date de publication), carte d'offre rendue cliquable,
gestion du cas « offre introuvable ». Tests au niveau de l'existant.

C'est cette page qui accueillera le bouton « Postuler » du ticket #14 : la faire d'abord évite
d'avoir à y revenir.

Travail court, et c'est ce qui sépare une liste consultable d'un site d'emploi crédible.

### #14 — Candidature à une offre, côté candidat

Sans cette fonctionnalité, le projet reste un site de consultation d'offres plutôt qu'une
plateforme de recrutement — ce qu'un entretien technique peut relever.

**Périmètre** — la candidature est enregistrée, confirmée au candidat et consultable par lui.
Aucun traitement côté entreprise : pas de destinataire, pas de suivi par un recruteur. Le statut
reste donc à sa valeur initiale.

**Livrables backend** — service et controller pour l'entité `Application` existante : postuler
à une offre publiée, lister ses propres candidatures, refuser une candidature en double. La
candidature exige un profil candidat complété.

**Livrables frontend** — bouton « Postuler » sur la page de détail, notification de confirmation,
état « déjà postulé » sur une offre à laquelle on a candidaté, et écran « Mes candidatures ».

**Confirmation par e-mail** reprenant l'intitulé du poste et l'entreprise.

> ⚠️ **Contrainte à arbitrer au moment de l'implémentation** : envoyer un e-mail demande des
> identifiants SMTP, c'est-à-dire un **secret**. Cela entre en tension avec l'objectif du ticket
> #8 (un dépôt sans aucun secret, lançable par n'importe qui). Supabase ne peut pas servir ici :
> il n'envoie que ses propres e-mails d'authentification.
>
> Piste retenue : l'envoi n'a lieu que si une configuration SMTP est fournie par variables
> d'environnement ; sinon le message est écrit dans les logs. La fonctionnalité reste donc
> démontrable sur un clone sans configuration, et réellement fonctionnelle quand les
> identifiants sont présents.

Chantier plus conséquent que #13, à arbitrer selon le temps disponible.

---

## Dettes connues, non bloquantes

- **Aucun endpoint n'est restreint par rôle** (`@PreAuthorize` absent du code de production).
  Le mécanisme est câblé et testé, mais inutile tant que seul le parcours candidat existe.
- **Les tests backend tournent sur H2 alors que la production utilise PostgreSQL** — voir les
  pièges connus dans `CLAUDE.md`. Des Testcontainers supprimeraient cet écart.
- **La page 404 est un simple paragraphe**, sans mise en page ni lien de retour.
- **Pas de TJM ni de photo** dans le formulaire de profil, alors que les colonnes existent en
  base — choix volontaire pour limiter la taille du formulaire.
- **Rien n'incite le nouvel inscrit à compléter son profil** : après confirmation de son adresse
  il arrive directement sur les offres, et le profil reste vide tant qu'il ne va pas le chercher.
  Un message d'invitation sur la page des offres suffirait.
