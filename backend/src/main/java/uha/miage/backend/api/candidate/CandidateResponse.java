package uha.miage.backend.api.candidate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;

public record CandidateResponse(
        Long id,
        UUID userId,
        String firstName,
        String lastName,
        String email,
        String headline,
        String phone,
        String city,
        String bio,
        String cvUrl,
        String photoUrl,
        String linkedinUrl,
        String githubUrl,
        Integer yearsOfExperience,
        BigDecimal desiredSalaryMin,
        BigDecimal desiredSalaryMax,
        BigDecimal desiredTjmMin,
        BigDecimal desiredTjmMax,
        WorkMode preferredWorkMode,
        List<ContractType> preferredContractTypes,
        Boolean isOpenToWork,
        Instant createdAt
) {
}
