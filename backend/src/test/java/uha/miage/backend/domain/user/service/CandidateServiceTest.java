package uha.miage.backend.domain.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
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
    void create_quandUserValideSansDoublon_alorsCreeCandidatEtAssigneRole() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("test@test.com").build();
        Candidate candidate = Candidate.builder().build();
        Candidate saved = Candidate.builder().id(1L).user(user).build();

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
    void create_quandDoublonCandidat_alorsBadRequestException() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("test@test.com").build();
        Candidate existing = Candidate.builder().id(1L).build();

        when(userService.findAndValidateForOnboarding(userId)).thenReturn(user);
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> candidateService.create(Candidate.builder().build(), userId, "Jean", "Dupont"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Cet utilisateur a déjà un profil candidat");
    }

    @Test
    void getByUserId_quandCandidatExiste_alorsRetourneCandidat() {
        UUID userId = UUID.randomUUID();
        Candidate candidate = Candidate.builder().id(1L).build();
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.of(candidate));

        Candidate result = candidateService.getByUserId(userId);

        assertThat(result).isEqualTo(candidate);
    }

    @Test
    void getByUserId_quandCandidatInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.getByUserId(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Profil candidat non trouvé");
    }
}
