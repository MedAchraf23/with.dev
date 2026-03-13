package uha.miage.backend.domain.user.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.core.exception.BadRequestException;
import uha.miage.backend.core.exception.ResourceNotFoundException;
import uha.miage.backend.domain.user.entity.Candidate;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.enums.UserRole;
import uha.miage.backend.domain.user.repository.CandidateRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserService userService;

    @Transactional
    public Candidate create(Candidate candidate, UUID userId, String firstName, String lastName) {
        User user = userService.findAndValidateForOnboarding(userId);

        if (candidateRepository.findByUserId(userId).isPresent()) {
            throw new BadRequestException("Cet utilisateur a déjà un profil candidat");
        }

        user.setRole(UserRole.CANDIDATE);
        user.setFirstName(firstName);
        user.setLastName(lastName);

        candidate.setUser(user);
        return candidateRepository.save(candidate);
    }

    public Candidate getByUserId(UUID userId) {
        return candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil candidat non trouvé"));
    }
}
