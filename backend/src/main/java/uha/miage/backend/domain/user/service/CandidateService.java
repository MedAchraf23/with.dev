package uha.miage.backend.domain.user.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.api.candidate.CandidateMapper;
import uha.miage.backend.api.candidate.UpdateCandidateRequest;
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
    private final CandidateMapper candidateMapper;

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

    @Transactional
    public Candidate update(UUID userId, UpdateCandidateRequest request) {
        Candidate candidate = getByUserId(userId);
        
        candidateMapper.updateCandidateFromRequest(request, candidate);
        
        if (request.firstName() != null || request.lastName() != null) {
            User user = candidate.getUser();
            if (request.firstName() != null) {
                user.setFirstName(request.firstName());
            }
            if (request.lastName() != null) {
                user.setLastName(request.lastName());
            }
        }
        
        return candidateRepository.save(candidate);
    }

    @Transactional
    public void delete(UUID userId) {
        Candidate candidate = getByUserId(userId);
        candidateRepository.delete(candidate);
    }
}
