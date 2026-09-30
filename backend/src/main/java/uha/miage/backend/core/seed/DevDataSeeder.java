package uha.miage.backend.core.seed;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.ExperienceLevel;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.company.entity.Company;
import uha.miage.backend.domain.company.enums.CompanySize;
import uha.miage.backend.domain.company.repository.CompanyRepository;
import uha.miage.backend.domain.job.entity.JobOffer;
import uha.miage.backend.domain.job.enums.JobOfferStatus;
import uha.miage.backend.domain.job.repository.JobOfferRepository;
import uha.miage.backend.domain.user.entity.Recruiter;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.enums.UserRole;
import uha.miage.backend.domain.user.repository.RecruiterRepository;
import uha.miage.backend.domain.user.repository.UserRepository;

/**
 * Alimente la base en données de démonstration au démarrage, uniquement sur le
 * profil dev et uniquement si aucune offre n'existe déjà.
 */
@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobOfferRepository jobOfferRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (jobOfferRepository.count() > 0) {
            log.info("Données de démonstration déjà présentes, insertion ignorée");
            return;
        }

        Company alsatech = createCompany("Alsatech", "Mulhouse", CompanySize.PME, "Informatique",
                "Éditeur de logiciels métier pour l'industrie, basé dans le Grand Est.");
        Company novasoft = createCompany("NovaSoft", "Strasbourg", CompanySize.STARTUP, "Éditeur de logiciels",
                "Studio produit spécialisé dans les applications web et mobiles.");
        Company rhinDigital = createCompany("Rhin Digital", "Lyon", CompanySize.ETI, "Conseil IT",
                "ESN accompagnant les grands comptes sur leurs projets cloud et data.");
        Company cortex = createCompany("Cortex Analytics", "Paris", CompanySize.STARTUP, "Data / IA",
                "Plateforme d'analyse de données pour le secteur de la santé.");

        Recruiter marie = createRecruiter("marie.laurent@alsatech.demo", "Marie", "Laurent",
                "Responsable recrutement", alsatech);
        Recruiter thomas = createRecruiter("thomas.bernard@rhindigital.demo", "Thomas", "Bernard",
                "Talent acquisition manager", rhinDigital);

        jobOfferRepository.saveAll(List.of(
                JobOffer.builder()
                        .company(alsatech)
                        .createdByRecruiter(marie)
                        .title("Développeur Java / Spring Boot")
                        .description("""
                                Vous rejoignez une équipe de six développeurs pour faire évoluer notre suite \
                                logicielle destinée aux industriels. Stack Java 21, Spring Boot, PostgreSQL. \
                                Revue de code systématique et tests automatisés au quotidien.""")
                        .contractType(ContractType.CDI)
                        .experienceLevel(ExperienceLevel.INTERMEDIATE)
                        .city("Mulhouse")
                        .workMode(WorkMode.HYBRID)
                        .salaryMin(BigDecimal.valueOf(42000))
                        .salaryMax(BigDecimal.valueOf(52000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(2))
                        .build(),

                JobOffer.builder()
                        .company(novasoft)
                        .createdByRecruiter(marie)
                        .title("Développeur Frontend React")
                        .description("""
                                Au sein d'un studio produit, vous concevez les interfaces de nos applications \
                                clientes. React, TypeScript, Tailwind. Une vraie attention est portée à \
                                l'accessibilité et à la qualité d'exécution.""")
                        .contractType(ContractType.CDI)
                        .experienceLevel(ExperienceLevel.JUNIOR)
                        .city("Strasbourg")
                        .workMode(WorkMode.HYBRID)
                        .salaryMin(BigDecimal.valueOf(35000))
                        .salaryMax(BigDecimal.valueOf(42000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(5))
                        .build(),

                JobOffer.builder()
                        .company(rhinDigital)
                        .createdByRecruiter(thomas)
                        .title("Ingénieur DevOps")
                        .description("""
                                Vous industrialisez les chaînes de déploiement de nos clients grands comptes. \
                                Kubernetes, Terraform, GitLab CI. Poste entièrement à distance, avec deux jours \
                                de regroupement par trimestre.""")
                        .contractType(ContractType.CDI)
                        .experienceLevel(ExperienceLevel.SENIOR)
                        .city("Lyon")
                        .workMode(WorkMode.FULL_REMOTE)
                        .salaryMin(BigDecimal.valueOf(55000))
                        .salaryMax(BigDecimal.valueOf(70000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(1))
                        .build(),

                JobOffer.builder()
                        .company(cortex)
                        .createdByRecruiter(thomas)
                        .title("Data Engineer")
                        .description("""
                                Vous construisez les pipelines qui alimentent notre plateforme d'analyse \
                                médicale. Python, Airflow, dbt, BigQuery. Environnement exigeant sur la qualité \
                                et la traçabilité des données.""")
                        .contractType(ContractType.CDI)
                        .experienceLevel(ExperienceLevel.INTERMEDIATE)
                        .city("Paris")
                        .workMode(WorkMode.HYBRID)
                        .salaryMin(BigDecimal.valueOf(48000))
                        .salaryMax(BigDecimal.valueOf(60000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(8))
                        .build(),

                JobOffer.builder()
                        .company(cortex)
                        .createdByRecruiter(thomas)
                        .title("Tech Lead Backend")
                        .description("""
                                Vous encadrez techniquement une équipe de cinq personnes et portez les choix \
                                d'architecture de notre plateforme. Expérience confirmée en systèmes distribués \
                                et en accompagnement d'équipe attendue.""")
                        .contractType(ContractType.CDI)
                        .experienceLevel(ExperienceLevel.LEAD)
                        .city("Paris")
                        .workMode(WorkMode.HYBRID)
                        .salaryMin(BigDecimal.valueOf(70000))
                        .salaryMax(BigDecimal.valueOf(85000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(12))
                        .build(),

                JobOffer.builder()
                        .company(rhinDigital)
                        .createdByRecruiter(thomas)
                        .title("Développeur Fullstack JavaScript")
                        .description("""
                                Mission longue durée chez un client du secteur assurantiel. Node.js côté serveur, \
                                React côté client. Autonomie complète sur le périmètre confié.""")
                        .contractType(ContractType.FREELANCE)
                        .experienceLevel(ExperienceLevel.SENIOR)
                        .city("Paris")
                        .workMode(WorkMode.FULL_REMOTE)
                        .tjmMin(BigDecimal.valueOf(500))
                        .tjmMax(BigDecimal.valueOf(650))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(3))
                        .build(),

                JobOffer.builder()
                        .company(rhinDigital)
                        .createdByRecruiter(thomas)
                        .title("Consultant Cloud AWS")
                        .description("""
                                Accompagnement d'une migration d'infrastructure vers AWS pour un acteur \
                                industriel. Certification AWS appréciée. Démarrage rapide souhaité.""")
                        .contractType(ContractType.FREELANCE)
                        .experienceLevel(ExperienceLevel.SENIOR)
                        .city("Lyon")
                        .workMode(WorkMode.FULL_REMOTE)
                        .tjmMin(BigDecimal.valueOf(550))
                        .tjmMax(BigDecimal.valueOf(700))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(6))
                        .build(),

                JobOffer.builder()
                        .company(alsatech)
                        .createdByRecruiter(marie)
                        .title("Ingénieur QA / Automatisation des tests")
                        .description("""
                                Vous structurez notre stratégie de tests automatisés et fiabilisez les livraisons. \
                                Selenium, Playwright, intégration continue. Remplacement d'un congé maternité.""")
                        .contractType(ContractType.CDD)
                        .experienceLevel(ExperienceLevel.INTERMEDIATE)
                        .city("Mulhouse")
                        .workMode(WorkMode.ON_SITE)
                        .salaryMin(BigDecimal.valueOf(38000))
                        .salaryMax(BigDecimal.valueOf(45000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(4))
                        .build(),

                JobOffer.builder()
                        .company(novasoft)
                        .createdByRecruiter(marie)
                        .title("Alternant Développeur Web")
                        .description("""
                                Vous participez au développement de nos applications clientes aux côtés d'un \
                                développeur confirmé qui vous accompagne tout au long de l'alternance. \
                                Rythme adaptable au calendrier de votre école.""")
                        .contractType(ContractType.ALTERNANCE)
                        .experienceLevel(ExperienceLevel.JUNIOR)
                        .city("Mulhouse")
                        .workMode(WorkMode.ON_SITE)
                        .salaryMin(BigDecimal.valueOf(12000))
                        .salaryMax(BigDecimal.valueOf(15000))
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(9))
                        .build(),

                JobOffer.builder()
                        .company(novasoft)
                        .createdByRecruiter(marie)
                        .title("Stage Développeur Mobile")
                        .description("""
                                Stage de fin d'études de six mois sur le développement de notre application \
                                mobile React Native. Encadrement par l'équipe produit, sujet de mémoire possible.""")
                        .contractType(ContractType.STAGE)
                        .experienceLevel(ExperienceLevel.JUNIOR)
                        .city("Strasbourg")
                        .workMode(WorkMode.ON_SITE)
                        .status(JobOfferStatus.PUBLISHED)
                        .publishedAt(daysAgo(7))
                        .build(),

                JobOffer.builder()
                        .company(alsatech)
                        .createdByRecruiter(marie)
                        .title("Architecte logiciel (offre en préparation)")
                        .description("Cette offre n'est pas publiée et ne doit jamais apparaître côté candidat.")
                        .contractType(ContractType.CDI)
                        .experienceLevel(ExperienceLevel.SENIOR)
                        .city("Mulhouse")
                        .workMode(WorkMode.HYBRID)
                        .status(JobOfferStatus.DRAFT)
                        .build()));

        log.info("Données de démonstration insérées : {} entreprises, {} offres",
                companyRepository.count(), jobOfferRepository.count());
    }

    private Company createCompany(String name, String city, CompanySize size, String sector, String description) {
        return companyRepository.save(Company.builder()
                .name(name)
                .city(city)
                .size(size)
                .sector(sector)
                .description(description)
                .build());
    }

    private Recruiter createRecruiter(String email, String firstName, String lastName, String position,
                                      Company company) {
        User user = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .role(UserRole.RECRUITER)
                .isActive(true)
                .build());

        return recruiterRepository.save(Recruiter.builder()
                .user(user)
                .company(company)
                .position(position)
                .build());
    }

    private static Instant daysAgo(int days) {
        return Instant.now().minus(Duration.ofDays(days));
    }
}
