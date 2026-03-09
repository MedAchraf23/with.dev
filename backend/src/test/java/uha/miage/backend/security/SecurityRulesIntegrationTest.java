package uha.miage.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

    // Cette méthode compile sans erreur chez toi
    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @TestConfiguration
    @RestController
    static class DummyTestController {
        @GetMapping("/test/recruiter-only")
        @PreAuthorize("hasRole('RECRUITER')")
        public String recruiterOnly() { return "OK"; }

        @GetMapping("/test/candidate-only")
        @PreAuthorize("hasRole('CANDIDATE')")
        public String candidateOnly() { return "OK"; }

        // La solution au 500 : on attrape l'erreur et on force un 403
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<String> handleAccessDenied() {
            return new ResponseEntity<>("Accès Refusé", HttpStatus.FORBIDDEN);
        }
    }

    @Test
    void quandAucunToken_alorsErreur401() throws Exception {
        mockMvc.perform(get("/test/candidate-only"))
               .andExpect(status().isUnauthorized()); 
    }

    @Test
    void quandCandidatVaSurRouteCandidat_alorsSucces200() throws Exception {
        mockMvc.perform(get("/test/candidate-only")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CANDIDATE"))))
               .andExpect(status().isOk()); 
    }

    @Test
    void quandCandidatVaSurRouteRecruteur_alorsErreur403() throws Exception {
        mockMvc.perform(get("/test/recruiter-only")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_CANDIDATE"))))
               .andExpect(status().isForbidden());
    }

    @Test
    void quandRecruteurVaSurRouteRecruteur_alorsSucces200() throws Exception {
        mockMvc.perform(get("/test/recruiter-only")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_RECRUITER"))))
               .andExpect(status().isOk());
    }
}