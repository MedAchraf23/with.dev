# --- Étape 1 : compilation ---
# L'image officielle Maven embarque le JDK 21 exigé par le pom.xml. On appelle
# « mvn » directement plutôt que ./mvnw : le wrapper sert à obtenir Maven sans
# l'avoir installé, ce que cette image fournit déjà, et il téléchargerait une
# seconde distribution pour rien. L'intégration continue, elle, passe bien par
# ./mvnw, afin d'utiliser la version de Maven que le projet déclare plutôt que
# celle préinstallée sur la machine GitHub.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Les dépendances sont téléchargées avant la copie du code : cette couche n'est
# invalidée que si pom.xml change, et non à chaque modification d'un .java.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
# Tests ignorés volontairement : ils tournent sur H2 et ne valident donc pas
# cette image. C'est le rôle de l'intégration continue.
RUN mvn -B package -DskipTests

# --- Étape 2 : exécution ---
# Seul le JRE est nécessaire pour lancer le jar : ni Maven, ni le JDK, ni les
# sources ne sont embarqués dans l'image finale.
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
USER app
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
