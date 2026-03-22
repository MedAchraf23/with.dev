package uha.miage.backend.api.candidate;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CandidateControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("POST /candidates - Crée un candidat et retourne 201")
    void postCandidates_quandUserValideSansRole_alorsCreeCandidatEtRetourne201() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        Map<String, Object> request = Map.of(
                "firstName", "Jean",
                "lastName", "Dupont",
                "phone", "0612345678",
                "city", "Mulhouse"
        );

        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.firstName").value("Jean"))
                .andExpect(jsonPath("$.lastName").value("Dupont"))
                .andExpect(jsonPath("$.phone").value("0612345678"))
                .andExpect(jsonPath("$.city").value("Mulhouse"));
    }

    @Test
    @DisplayName("POST /candidates - Retourne 400 quand le prénom est manquant")
    void postCandidates_quandPrenomManquant_alorsRetourne400() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        Map<String, Object> request = Map.of(
                "lastName", "Dupont"
        );

        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /candidates - Retourne 400 quand le nom est manquant")
    void postCandidates_quandNomManquant_alorsRetourne400() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        Map<String, Object> request = Map.of(
                "firstName", "Jean"
        );

        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /candidates - Retourne 400 quand le candidat existe déjà")
    void postCandidates_quandDoublon_alorsRetourne400() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        Map<String, Object> request = Map.of(
                "firstName", "Jean",
                "lastName", "Dupont"
        );

        // Première création
        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Doublon
        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /candidates - Retourne 401 sans token JWT")
    void postCandidates_quandAucunToken_alorsRetourne401() throws Exception {
        Map<String, Object> request = Map.of(
                "firstName", "Jean",
                "lastName", "Dupont"
        );

        mockMvc.perform(post("/candidates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /candidates/me - Retourne le profil candidat existant")
    void getCandidatesMe_quandCandidatExiste_alorsRetourne200() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        Map<String, Object> request = Map.of(
                "firstName", "Jean",
                "lastName", "Dupont"
        );

        // Créer le candidat d'abord
        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Récupérer le profil
        mockMvc.perform(get("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Jean"))
                .andExpect(jsonPath("$.lastName").value("Dupont"))
                .andExpect(jsonPath("$.email").value("candidat@test.com"));
    }

    @Test
    @DisplayName("GET /candidates/me - Retourne 404 quand le candidat n'existe pas")
    void getCandidatesMe_quandCandidatInexistant_alorsRetourne404() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(get("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString()))))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /candidates/me - Retourne 401 sans token JWT")
    void getCandidatesMe_quandAucunToken_alorsRetourne401() throws Exception {
        mockMvc.perform(get("/candidates/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PATCH /candidates/me - Met à jour le candidat et retourne 200")
    void patchCandidatesMe_quandDonneesValides_alorsMajCandidatEtRetourne200() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        // Créer un candidat d'abord
        Map<String, Object> createRequest = Map.of(
                "firstName", "Jean",
                "lastName", "Dupont",
                "phone", "0612345678",
                "city", "Mulhouse"
        );

        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated());

        // Mettre à jour le candidat
        Map<String, Object> updateRequest = Map.of(
                "firstName", "Jacques",
                "phone", "0687654321",
                "city", "Strasbourg"
        );

        mockMvc.perform(patch("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Jacques"))
                .andExpect(jsonPath("$.lastName").value("Dupont"))
                .andExpect(jsonPath("$.phone").value("0687654321"))
                .andExpect(jsonPath("$.city").value("Strasbourg"));
    }

    @Test
    @DisplayName("PATCH /candidates/me - Retourne 404 quand le candidat n'existe pas")
    void patchCandidatesMe_quandCandidatInexistant_alorsRetourne404() throws Exception {
        UUID userId = UUID.randomUUID();

        Map<String, Object> updateRequest = Map.of(
                "phone", "0687654321"
        );

        mockMvc.perform(patch("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PATCH /candidates/me - Retourne 401 sans token JWT")
    void patchCandidatesMe_quandAucunToken_alorsRetourne401() throws Exception {
        Map<String, Object> updateRequest = Map.of(
                "phone", "0687654321"
        );

        mockMvc.perform(patch("/candidates/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("DELETE /candidates/me - Supprime le candidat et retourne 204")
    void deleteCandidatesMe_quandCandidatExiste_alorsSupprimeEtRetourne204() throws Exception {
        UUID userId = UUID.randomUUID();
        userRepository.save(User.builder().id(userId).email("candidat@test.com").isActive(true).build());

        // Créer un candidat d'abord
        Map<String, Object> createRequest = Map.of(
                "firstName", "Jean",
                "lastName", "Dupont"
        );

        mockMvc.perform(post("/candidates")
                        .with(jwt().jwt(j -> j.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated());

        // Vérifier que le candidat existe
        mockMvc.perform(get("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString()))))
                .andExpect(status().isOk());

        // Supprimer le candidat
        mockMvc.perform(delete("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString()))))
                .andExpect(status().isNoContent());

        // Vérifier que le candidat n'existe plus
        mockMvc.perform(get("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString()))))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /candidates/me - Retourne 404 quand le candidat n'existe pas")
    void deleteCandidatesMe_quandCandidatInexistant_alorsRetourne404() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(delete("/candidates/me")
                        .with(jwt().jwt(j -> j.subject(userId.toString()))))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /candidates/me - Retourne 401 sans token JWT")
    void deleteCandidatesMe_quandAucunToken_alorsRetourne401() throws Exception {
        mockMvc.perform(delete("/candidates/me"))
                .andExpect(status().isUnauthorized());
    }
}
