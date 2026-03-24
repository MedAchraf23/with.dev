package uha.miage.backend.domain.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.instancio.Select.field;
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
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.enums.UserRole;
import uha.miage.backend.domain.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    // ===== findAndValidateForOnboarding =====

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

    // ===== getById =====

    @Test
    @DisplayName("Retourne le user quand il existe")
    void getById_quandUserExiste_alorsRetourneUser() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User result = userService.getById(userId);

        assertThat(result).isEqualTo(user);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le user n'existe pas")
    void getById_quandUserInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getById(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Utilisateur non trouvé");
    }

    // ===== update =====

    @Test
    @DisplayName("Met à jour firstName et lastName et retourne le user modifié")
    void update_quandUserExiste_alorsMiseAJourEtRetourneUser() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.update(userId, "Jean", "Dupont");

        assertThat(user.getFirstName()).isEqualTo("Jean");
        assertThat(user.getLastName()).isEqualTo("Dupont");
        assertThat(result).isEqualTo(user);
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le user n'existe pas pour update")
    void update_quandUserInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.update(userId, "Jean", "Dupont"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Utilisateur non trouvé");
    }

    // ===== delete =====

    @Test
    @DisplayName("Supprime le user quand il existe")
    void delete_quandUserExiste_alorsSupprime() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        userService.delete(userId);

        verify(userRepository).delete(user);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le user n'existe pas pour delete")
    void delete_quandUserInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.delete(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Utilisateur non trouvé");
    }

        // ===== archiveUser =====

    @Test
    @DisplayName("Archive le user quand il existe")
    void archiveUser_quandUserExiste_alorsDesactiveUser() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .set(field(User::getIsActive), true)
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.archiveUser(userId);

        assertThat(user.getIsActive()).isFalse();
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le user n'existe pas pour archiveUser")
    void archiveUser_quandUserInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.archiveUser(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Utilisateur non trouvé");
    }

    // ===== unarchiveUser =====

    @Test
    @DisplayName("Réactive le user quand il existe")
    void unarchiveUser_quandUserExiste_alorsReactiveUser() {
        UUID userId = UUID.randomUUID();
        User user = Instancio.of(User.class)
                .set(field(User::getId), userId)
                .set(field(User::getIsActive), false)
                .create();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.unarchiveUser(userId);

        assertThat(user.getIsActive()).isTrue();
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand le user n'existe pas pour unarchiveUser")
    void unarchiveUser_quandUserInexistant_alorsResourceNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.unarchiveUser(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Utilisateur non trouvé");
    }

}