package uha.miage.backend.api.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class UserControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private UserRepository userRepository;

        @Test
        @DisplayName("GET /users/me - Retourne le user connecté")
        void getUsersMe_quandUserExiste_alorsRetourne200() throws Exception {
                UUID userId = UUID.randomUUID();
                userRepository.save(User.builder()
                                .id(userId)
                                .email("user@test.com")
                                .isActive(true)
                                .build());

                mockMvc.perform(get("/users/me")
                                .with(jwt().jwt(j -> j.subject(userId.toString()))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(userId.toString()))
                                .andExpect(jsonPath("$.email").value("user@test.com"));
        }

        @Test
        @DisplayName("GET /users/me - Retourne 404 quand le user n'existe pas")
        void getUsersMe_quandUserInexistant_alorsRetourne404() throws Exception {
                UUID userId = UUID.randomUUID();

                mockMvc.perform(get("/users/me")
                                .with(jwt().jwt(j -> j.subject(userId.toString()))))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("GET /users/me - Retourne 401 sans token JWT")
        void getUsersMe_quandAucunToken_alorsRetourne401() throws Exception {
                mockMvc.perform(get("/users/me"))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("PATCH /users/archive - Archive le user et retourne 204")
        void patchArchive_quandUserAuthentifie_alorsRetourne204() throws Exception {
                UUID userId = UUID.randomUUID();
                userRepository.save(User.builder()
                                .id(userId)
                                .email("user@test.com")
                                .isActive(true)
                                .build());

                mockMvc.perform(patch("/users/archive")
                                .with(jwt().jwt(j -> j.subject(userId.toString()))))
                                .andExpect(status().isNoContent());

                User updated = userRepository.findById(userId).orElseThrow();
                assertThat(updated.getIsActive()).isFalse();
                assertThat(updated.getDeletedAt()).isNotNull();
        }

        @Test
        @DisplayName("PATCH /users/unarchive - Réactive le user et retourne 204")
        void patchUnarchive_quandUserAuthentifie_alorsRetourne204() throws Exception {
                UUID userId = UUID.randomUUID();
                userRepository.save(User.builder()
                                .id(userId)
                                .email("user@test.com")
                                .isActive(false)
                                .deletedAt(Instant.now())
                                .build());

                mockMvc.perform(patch("/users/unarchive")
                                .with(jwt().jwt(j -> j.subject(userId.toString()))))
                                .andExpect(status().isNoContent());

                User updated = userRepository.findById(userId).orElseThrow();
                assertThat(updated.getIsActive()).isTrue();
                assertThat(updated.getDeletedAt()).isNull();
        }

        @Test
        @DisplayName("PATCH /users/archive - Retourne 401 sans token JWT")
        void patchArchive_quandAucunToken_alorsRetourne401() throws Exception {
                mockMvc.perform(patch("/users/archive"))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("PATCH /users/unarchive - Retourne 401 sans token JWT")
        void patchUnarchive_quandAucunToken_alorsRetourne401() throws Exception {
                mockMvc.perform(patch("/users/unarchive"))
                                .andExpect(status().isUnauthorized());
        }

}