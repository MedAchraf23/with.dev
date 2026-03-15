package uha.miage.backend.domain.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.instancio.Select.field;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.instancio.Instancio;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uha.miage.backend.core.exception.BadRequestException;
import uha.miage.backend.core.exception.ResourceNotFoundException;
import uha.miage.backend.domain.user.entity.Candidate;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.enums.UserRole;
import uha.miage.backend.domain.user.repository.CandidateRepository;

@ExtendWith(MockitoExtension.class)
class CandidateServiceTest {

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CandidateService candidateService;

    @Test
    @DisplayName("Crée un candidat et assigne le rôle CANDIDATE au user")
    void create_quandUserValideSansDoublon_alorsCreeCandidatEtAssigneRole() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .ignore(field(User::getRole))
                .create();
        Candidate candidate = Instancio.of(Candidate.class)
                .ignore(field(Candidate::getId))
                .ignore(field(Candidate::getUser))
                .create();
        Candidate saved = Instancio.of(Candidate.class)
                .set(field(Candidate::getUser), user)
                .create();

        when(userService.findAndValidateForOnboarding(userId)).thenReturn(user);
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(candidateRepository.save(any(Candidate.class))).thenReturn(saved);

        Candidate result = candidateService.create(candidate, userId, "Jean", "Dupont");

        assertThat(result).isEqualTo(saved);
        assertThat(user.getRole()).isEqualTo(UserRole.CANDIDATE);
        assertThat(user.getFirstName()).isEqualTo("Jean");
        assertThat(user.getLastName()).isEqualTo("Dupont");
        verify(candidateRepository).save(candidate);
    }

    @Test
    @DisplayName("Lève BadRequestException quand le candidat existe déjà")
    void create_quandDoublonCandidat_alorsBadRequestException() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .create();
        Candidate existing = Instancio.create(Candidate.class);

        when(userService.findAndValidateForOnboarding(userId)).thenReturn(user);
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.of(existing));

        Candidate candidate = Instancio.of(Candidate.class)
                .ignore(field(Candidate::getId))
                .create();

        assertThatThrownBy(() -> candidateService.create(candidate, userId, "Jean", "Dupont"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Cet utilisateur a déjà un profil candidat");
    }

    @Test
    @DisplayName("Retourne le candidat quand il existe")
    void getByUserId_quandCandidatExiste_alorsRetourneCandidat() {
        UUID userId = UUID.randomUUID();
        Candidate candidate = Instancio.create(Candidate.class);
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.of(candidate));

        Candidate result = candidateService.getByUserId(userId);

        assertThat(result).isEqualTo(candidate);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le candidat n'existe pas")
    void getByUserId_quandCandidatInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.getByUserId(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Profil candidat non trouvé");
    }
}
