package uha.miage.backend.api.candidate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;

// TODO: Si onboarding multi-écrans, retirer les @NotBlank et ajouter PATCH /api/candidates/me
public record CreateCandidateRequest(
        @NotBlank(message = "Le prénom est obligatoire")
        String firstName,
        @NotBlank(message = "Le nom est obligatoire")
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
        @PositiveOrZero(message = "Le salaire minimum ne peut pas être négatif")
        BigDecimal desiredSalaryMin,
        @PositiveOrZero(message = "Le salaire maximum ne peut pas être négatif")
        BigDecimal desiredSalaryMax,
        @PositiveOrZero(message = "Le TJM minimum ne peut pas être négatif")
        BigDecimal desiredTjmMin,
        @PositiveOrZero(message = "Le TJM maximum ne peut pas être négatif")
        BigDecimal desiredTjmMax,
        WorkMode preferredWorkMode,
        List<ContractType> preferredContractTypes,
        Boolean isOpenToWork
) {
}


