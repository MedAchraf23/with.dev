package uha.miage.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class SecurityRulesIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    /**
     * On crée un faux contrôleur qui n'existera QUE pendant l'exécution des tests.
     * Il remplace ton ancien SecurityTestController.
     */
    @TestConfiguration
    @RestController
    static class DummyTestController {
        @GetMapping("/test/recruiter-only")
        @PreAuthorize("hasRole('RECRUITER')")
        public String recruiterOnly() { return "OK"; }

        @GetMapping("/test/candidate-only")
        @PreAuthorize("hasRole('CANDIDATE')")
        public String candidateOnly() { return "OK"; }
    }

    @Test
    void quandAucunToken_alorsErreur401() throws Exception {
        mockMvc.perform(get("/test/candidate-only"))
               .andExpect(status().isUnauthorized()); // Vérifie qu'on a bien un 401
    }

    @Test
    void quandCandidatVaSurRouteCandidat_alorsSucces200() throws Exception {
        // On simule un token qui possède le rôle CANDIDATE
        mockMvc.perform(get("/test/candidate-only")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CANDIDATE"))))
               .andExpect(status().isOk()); // Vérifie qu'on a bien un 200 OK
    }

    @Test
    void quandCandidatVaSurRouteRecruteur_alorsErreur403() throws Exception {
        // On simule un Candidat qui tente d'aller dans la zone Recruteur
        mockMvc.perform(get("/test/recruiter-only")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CANDIDATE"))))
               .andExpect(status().isForbidden()); // Vérifie qu'on a bien un 403 (Accès refusé)
    }

    @Test
    void quandRecruteurVaSurRouteRecruteur_alorsSucces200() throws Exception {
        mockMvc.perform(get("/test/recruiter-only")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_RECRUITER"))))
               .andExpect(status().isOk());
    }
}