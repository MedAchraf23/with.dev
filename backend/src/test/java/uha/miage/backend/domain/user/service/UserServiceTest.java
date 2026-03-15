package uha.miage.backend.domain.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.instancio.Select.field;
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
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.enums.UserRole;
import uha.miage.backend.domain.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Retourne le user quand il existe sans rôle")
    void findAndValidateForOnboarding_quandUserExisteSansRole_alorsRetourneUser() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .ignore(field(User::getRole))
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User result = userService.findAndValidateForOnboarding(userId);

        assertThat(result).isEqualTo(user);
        assertThat(result.getRole()).isNull();
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le user n'existe pas")
    void findAndValidateForOnboarding_quandUserInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findAndValidateForOnboarding(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Utilisateur non trouvé");
    }

    @Test
    @DisplayName("Lève BadRequestException quand le user a déjà un rôle")
    void findAndValidateForOnboarding_quandUserAvecRole_alorsBadRequestException() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .set(field(User::getRole), UserRole.CANDIDATE)
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.findAndValidateForOnboarding(userId))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Cet utilisateur a déjà complété son onboarding");
    }
}
