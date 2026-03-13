package uha.miage.backend.api.candidate;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;

public record CreateCandidateRequest(
        @NotNull(message = "L'identifiant utilisateur est obligatoire")
        UUID userId,
        @NotNull(message = "Le prénom est obligatoire")
        String firstName,
        @NotNull(message = "Le nom est obligatoire")
        String lastName,
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
        Boolean isOpenToWork
) {
}


