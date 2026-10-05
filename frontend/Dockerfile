# --- Étape 1 : build Vite ---
FROM node:22-alpine AS build
WORKDIR /build

# Même logique que côté backend : les dépendances d'abord, le code ensuite, pour
# que modifier un composant ne relance pas npm ci.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite n'évalue pas les variables à l'exécution : il remplace textuellement
# chaque import.meta.env.VITE_* par sa valeur pendant la compilation. Elles
# doivent donc arriver en arguments de build, pas en variables de conteneur.
# Déclarés après npm ci : un ARG invalide le cache de tout ce qui suit.
# Docker signale un avertissement SecretsUsedInArgOrEnv sur la clé Supabase,
# parce que son nom contient « KEY ». C'est un faux positif : une clé
# publishable est conçue pour être lue par le navigateur de chaque visiteur,
# et ce sont les règles RLS de Supabase qui protègent les données.
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# --- Étape 2 : service des fichiers statiques ---
# Il ne reste que du HTML, du CSS et du JS : aucun Node n'est nécessaire ici.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
