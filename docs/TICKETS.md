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

### #8 — Conteneurisation

`docker compose up` sur un clone neuf lance la base, le backend et le frontend, sans aucune
configuration à fournir. `application.properties` est désormais versionné et sans secret : chaque
valeur dépendant de l'environnement est lue via `${VARIABLE:défaut}`, les défauts visant le
PostgreSQL local et le compose injectant l'adresse interne `db:5432`. Les deux images sont
construites en multi-étapes (Maven puis JRE seul ; Vite puis nginx seul), les variables `VITE_*`
passant par des arguments de build puisque Vite les fige à la compilation.

La base du compose est un PostgreSQL **local** et non la base Supabase : s'y connecter exigerait
de publier son mot de passe, le seul vrai secret du système. L'authentification continue de passer
par le Supabase cloud, qui ne demande que des valeurs publiques. Le frontend est publié sur le
port 5173, seule origine acceptée par le CORS et attendue par les redirections Supabase.

Effet de bord utile : les tests backend tournaient jusqu'ici grâce à un fichier non versionné, et
échouaient donc sur un clone neuf. Ils passent maintenant sans configuration, ce qui débloque #10.

### #10 — Intégration continue GitHub Actions

`.github/workflows/ci.yml` : à chaque push, deux travaux en parallèle — backend (`./mvnw test`,
70 tests sur H2) et frontend (`npm ci`, typage, 193 tests, build de production) — avec mise en
cache des dépendances Maven et npm.

**Périmètre élargi** par rapport à la description d'origine, qui s'arrêtait à la compilation et
aux tests : un troisième travail construit les deux images et les publie sur
`ghcr.io/medachraf23/with.dev/backend` et `.../frontend`, taguées avec le SHA du commit **et**
`latest`. Il dépend de la réussite des deux premiers.

Les images sont **construites sur toutes les branches, publiées depuis `main` seulement** : la
condition porte sur le paramètre `push` des étapes de construction, et non sur le travail entier.
Construire est une vérification au même titre qu'un test — un `Dockerfile` cassé est signalé sur
la branche, avant la fusion — tandis que `latest` continue de ne désigner que du code fusionné et
testé.

Le nom du dépôt est converti en minuscules dans le workflow, `ghcr.io` refusant les majuscules de
`MedAchraf23`. L'authentification au registre passe par le jeton fourni automatiquement à chaque
exécution : aucun secret à configurer, dans la continuité du ticket #8.

Effet de bord, de nouveau : `npm test` ne tenait que grâce au `.env` local, ignoré par git. Trois
assertions comparent l'URL appelée à `http://localhost:8081/api`, et `supabase.api.ts` lève une
exception à l'import quand ses variables sont vides, ce qui faisait échouer cinq fichiers de tests
sur un clone neuf. Un `frontend/.env.test` versionné — chargé par Vite en mode test, prioritaire
sur `.env`, sans aucun secret — rend les 193 tests verts sans configuration. Même nature de
correctif que celui du ticket #8 côté backend.

Le badge d'état reste à placer dans le README au ticket #11. Rien à régler à la main côté GitHub :
publiés par un workflow depuis un dépôt public, les paquets en héritent la visibilité, et un
`docker pull` anonyme des deux images fonctionne (vérifié par une requête non authentifiée au
registre).

---

## Empaquetage du projet

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
  pièges connus dans `CLAUDE.md`. Des Testcontainers supprimeraient cet écart, au prix d'un
  service PostgreSQL à déclarer dans le workflow de CI, qui n'a aujourd'hui besoin d'aucun
  service externe.
- **Aucun outil de migration de schéma** : c'est `spring.jpa.hibernate.ddl-auto=update` qui crée
  les tables. Suffisant pour une base de démonstration recréée à volonté, inadapté à une vraie
  production où un schéma existant doit évoluer sans perte. Flyway serait le choix correct.
- **La page 404 est un simple paragraphe**, sans mise en page ni lien de retour.
- **Pas de TJM ni de photo** dans le formulaire de profil, alors que les colonnes existent en
  base — choix volontaire pour limiter la taille du formulaire.
- **Rien n'incite le nouvel inscrit à compléter son profil** : après confirmation de son adresse
  il arrive directement sur les offres, et le profil reste vide tant qu'il ne va pas le chercher.
  Un message d'invitation sur la page des offres suffirait.
