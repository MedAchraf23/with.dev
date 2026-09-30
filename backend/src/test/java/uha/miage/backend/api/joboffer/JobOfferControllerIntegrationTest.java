package uha.miage.backend.api.joboffer;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.company.entity.Company;
import uha.miage.backend.domain.company.repository.CompanyRepository;
import uha.miage.backend.domain.job.entity.JobOffer;
import uha.miage.backend.domain.job.enums.JobOfferStatus;
import uha.miage.backend.domain.job.repository.JobOfferRepository;
import uha.miage.backend.domain.user.entity.Recruiter;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.repository.RecruiterRepository;
import uha.miage.backend.domain.user.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class JobOfferControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private JobOfferRepository jobOfferRepository;

    private final UUID candidateId = UUID.randomUUID();
    private Recruiter recruiter;
    private Company company;

    @BeforeEach
    void setUp() {
        company = companyRepository.save(Company.builder()
                .name("Acme")
                .logoUrl("https://acme.test/logo.png")
                .build());

        User recruiterUser = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .email("recruteur@test.com")
                .isActive(true)
                .build());

        recruiter = recruiterRepository.save(Recruiter.builder()
                .user(recruiterUser)
                .company(company)
                .build());
    }

    private JobOffer givenOffer(String title, String city, ContractType contractType, WorkMode workMode,
                                JobOfferStatus status) {
        return jobOfferRepository.save(JobOffer.builder()
                .company(company)
                .createdByRecruiter(recruiter)
                .title(title)
                .description("Description de " + title)
                .contractType(contractType)
                .city(city)
                .workMode(workMode)
                .status(status)
                .salaryMin(new BigDecimal("40000"))
                .salaryMax(new BigDecimal("55000"))
                .publishedAt(Instant.now())
                .build());
    }

    // ===== GET /job-offers =====

    @Test
    @DisplayName("GET /job-offers - Retourne les offres publiées avec les infos de l'entreprise")
    void getJobOffers_quandOffresPubliees_alorsRetourneListeAvecEntreprise() throws Exception {
        givenOffer("Développeur Java", "Mulhouse", ContractType.CDI, WorkMode.HYBRID, JobOfferStatus.PUBLISHED);

        mockMvc.perform(get("/job-offers").with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Développeur Java"))
                .andExpect(jsonPath("$[0].city").value("Mulhouse"))
                .andExpect(jsonPath("$[0].contractType").value("CDI"))
                .andExpect(jsonPath("$[0].companyName").value("Acme"))
                .andExpect(jsonPath("$[0].companyLogoUrl").value("https://acme.test/logo.png"));
    }

    @Test
    @DisplayName("GET /job-offers - N'expose jamais les offres non publiées")
    void getJobOffers_quandOffreBrouillon_alorsNonRetournee() throws Exception {
        givenOffer("Offre brouillon", "Mulhouse", ContractType.CDI, WorkMode.HYBRID, JobOfferStatus.DRAFT);
        givenOffer("Offre fermée", "Mulhouse", ContractType.CDI, WorkMode.HYBRID, JobOfferStatus.CLOSED);

        mockMvc.perform(get("/job-offers").with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(0)));
    }

    @Test
    @DisplayName("GET /job-offers - Filtre sur le titre sans tenir compte de la casse")
    void getJobOffers_quandRecherche_alorsFiltreSurTitre() throws Exception {
        givenOffer("Développeur Java", "Mulhouse", ContractType.CDI, WorkMode.HYBRID, JobOfferStatus.PUBLISHED);
        givenOffer("Designer UX", "Mulhouse", ContractType.CDI, WorkMode.HYBRID, JobOfferStatus.PUBLISHED);

        mockMvc.perform(get("/job-offers")
                        .param("search", "JAVA")
                        .with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Développeur Java"));
    }

    @Test
    @DisplayName("GET /job-offers - Filtre sur la ville, le type de contrat et le mode de travail")
    void getJobOffers_quandFiltres_alorsRetourneOffresCorrespondantes() throws Exception {
        givenOffer("Dev backend", "Strasbourg", ContractType.CDI, WorkMode.FULL_REMOTE, JobOfferStatus.PUBLISHED);
        givenOffer("Dev frontend", "Mulhouse", ContractType.FREELANCE, WorkMode.HYBRID, JobOfferStatus.PUBLISHED);

        mockMvc.perform(get("/job-offers")
                        .param("city", "strasbourg")
                        .param("contractType", "CDI")
                        .param("workMode", "FULL_REMOTE")
                        .with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Dev backend"));
    }

    @Test
    @DisplayName("GET /job-offers - Retourne 401 sans jeton")
    void getJobOffers_quandNonAuthentifie_alorsRetourne401() throws Exception {
        mockMvc.perform(get("/job-offers"))
                .andExpect(status().isUnauthorized());
    }

    // ===== GET /job-offers/{id} =====

    @Test
    @DisplayName("GET /job-offers/{id} - Retourne le détail d'une offre publiée")
    void getJobOfferById_quandOffrePubliee_alorsRetourneDetail() throws Exception {
        JobOffer offer = givenOffer("Développeur Java", "Mulhouse", ContractType.CDI, WorkMode.HYBRID,
                JobOfferStatus.PUBLISHED);

        mockMvc.perform(get("/job-offers/" + offer.getId())
                        .with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(offer.getId()))
                .andExpect(jsonPath("$.title").value("Développeur Java"))
                .andExpect(jsonPath("$.description").value("Description de Développeur Java"))
                .andExpect(jsonPath("$.companyName").value("Acme"));
    }

    @Test
    @DisplayName("GET /job-offers/{id} - Retourne 404 quand l'offre n'est pas publiée")
    void getJobOfferById_quandOffreBrouillon_alorsRetourne404() throws Exception {
        JobOffer offer = givenOffer("Offre brouillon", "Mulhouse", ContractType.CDI, WorkMode.HYBRID,
                JobOfferStatus.DRAFT);

        mockMvc.perform(get("/job-offers/" + offer.getId())
                        .with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /job-offers/{id} - Retourne 404 quand l'offre n'existe pas")
    void getJobOfferById_quandOffreInexistante_alorsRetourne404() throws Exception {
        mockMvc.perform(get("/job-offers/999999")
                        .with(jwt().jwt(j -> j.subject(candidateId.toString()))))
                .andExpect(status().isNotFound());
    }
}
