# MeetTalent 

**Remarque**
Le projet fonctionne avec Java 25. Si vous n'avez pas cette version, vous pouvez la télécharger ici : https://www.oracle.com/fr/java/technologies/downloads/

## Dépendances 
### Base 
- **Spring Web** - Starter permettant de gérer les *connexions Http* grâce aux annotations @RestController, @RequestMapping ou encore @Get/Post/Put/Patch/DeleteMapping.
- **Lombok** - Bibliothèque permettant de générer du code de classe via annotation (à utiliser pour générer les constructeurs, les builders, les getters et les setters).
### Database
- **Spring Data JPA** - Starter permettant d'utiliser le module de persistence de Spring (Hibernate JPA) qui permettra de créer et manipuler les tables de la base de données (voir, la classe JpaRepository).
- **MariaDB Driver** - Driver MariaDB pour Hibernate JPA.
### Security
- **Spring Security** - Starter permettant la gestion des providers sur les connexions Http. 
- **Spring Security Crypto** - Driver de spring Security utilisé pour la cryptographie. 
- **jjwt-api**, **jjwt-impl**, **jjwt-jackson** - Bibliothèques permettant la manipulation des tokens JWT.