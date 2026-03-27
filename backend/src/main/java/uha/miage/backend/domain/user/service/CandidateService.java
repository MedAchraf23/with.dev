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
import uha.miage.backend.domain.common.UpdateUtils;

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

    @Transactional
    public Candidate update(UUID userId, Candidate partialUpdates, String firstName, String lastName) {
        
        Candidate existing = getByUserId(userId);
        User user = existing.getUser();

        UpdateUtils.setIfNotNull(firstName, user::setFirstName);
        UpdateUtils.setIfNotNull(lastName, user::setLastName);

        UpdateUtils.setIfNotNull(partialUpdates.getHeadline(), existing::setHeadline);
        UpdateUtils.setIfNotNull(partialUpdates.getPhone(), existing::setPhone);
        UpdateUtils.setIfNotNull(partialUpdates.getCity(), existing::setCity);
        UpdateUtils.setIfNotNull(partialUpdates.getBio(), existing::setBio);

        UpdateUtils.setIfNotNull(partialUpdates.getCvUrl(), existing::setCvUrl);
        UpdateUtils.setIfNotNull(partialUpdates.getPhotoUrl(), existing::setPhotoUrl);
        UpdateUtils.setIfNotNull(partialUpdates.getLinkedinUrl(), existing::setLinkedinUrl);
        UpdateUtils.setIfNotNull(partialUpdates.getGithubUrl(), existing::setGithubUrl);

        UpdateUtils.setIfNotNull(partialUpdates.getYearsOfExperience(), existing::setYearsOfExperience);
        UpdateUtils.setIfNotNull(partialUpdates.getDesiredSalaryMin(), existing::setDesiredSalaryMin);
        UpdateUtils.setIfNotNull(partialUpdates.getDesiredSalaryMax(), existing::setDesiredSalaryMax);
        UpdateUtils.setIfNotNull(partialUpdates.getDesiredTjmMin(), existing::setDesiredTjmMin);
        UpdateUtils.setIfNotNull(partialUpdates.getDesiredTjmMax(), existing::setDesiredTjmMax);

        UpdateUtils.setIfNotNull(partialUpdates.getPreferredWorkMode(), existing::setPreferredWorkMode);
        UpdateUtils.setIfNotNull(partialUpdates.getPreferredContractTypes(), existing::setPreferredContractTypes);
        UpdateUtils.setIfNotNull(partialUpdates.getIsOpenToWork(), existing::setIsOpenToWork);

        return existing;
    }

    @Transactional
    public void delete(UUID userId) {
        Candidate candidate = getByUserId(userId);
        candidateRepository.delete(candidate);
    }
}
