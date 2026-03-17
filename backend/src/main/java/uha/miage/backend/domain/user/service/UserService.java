package uha.miage.backend.domain.user.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.core.exception.BadRequestException;
import uha.miage.backend.core.exception.ResourceNotFoundException;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public User findAndValidateForOnboarding(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (user.getRole() != null) {
            throw new BadRequestException("Cet utilisateur a déjà complété son onboarding");
        }

        return user;
    }

    public User getById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    }

    public User update(UUID userId, String firstName, String lastName) {
        User user = getById(userId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        return userRepository.save(user);

    }

    public void delete(UUID userId) {
        User user = getById(userId);
        userRepository.delete(user);
    }
}
