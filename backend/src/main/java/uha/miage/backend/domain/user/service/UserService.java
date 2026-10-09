package uha.miage.backend.domain.user.service;

import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.core.exception.BadRequestException;
import uha.miage.backend.core.exception.ResourceNotFoundException;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.repository.UserRepository;

/** Manages the application user behind a Supabase account: provisioning, lookup, profile and archiving. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    /** Returns the user for this Supabase id, creating the row on first authenticated request (provisioning). */
    @Transactional
    public User getOrCreate(UUID userId, String email) {
        return userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .id(userId)
                                .email(email)
                                .build()));
    }

    /** Loads the user and ensures onboarding has not happened yet (role still null). */
    public User findAndValidateForOnboarding(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (user.getRole() != null) {
            throw new BadRequestException("Cet utilisateur a déjà complété son onboarding");
        }

        return user;
    }

    /** Loads the user by id, or throws if none exists. */
    public User getById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    }

    /** Updates the user's first and last name. */
    @Transactional
    public User update(UUID userId, String firstName, String lastName) {
        User user = getById(userId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        return userRepository.save(user);
    }

    /** Permanently removes the user. */
    @Transactional
    public void delete(UUID userId) {
        User user = getById(userId);
        userRepository.delete(user);
    }

    /** Soft-deletes the user: marks inactive and stamps the deletion time. */
    @Transactional
    public void archiveUser(UUID userId) {
        User user = getById(userId);
        if (!user.getIsActive()) {
            throw new BadRequestException("Cet utilisateur est déjà archivé");
        }
        user.setIsActive(false);
        user.setDeletedAt(Instant.now());
    }

    /** Reverses archiving: marks the user active again and clears the deletion time. */
    @Transactional
    public void unarchiveUser(UUID userId) {
        User user = getById(userId);
        if (user.getIsActive()) {
            throw new BadRequestException("Cet utilisateur est déjà actif");
        }
        user.setIsActive(true);
        user.setDeletedAt(null);
    }
}