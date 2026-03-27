package uha.miage.backend.api.candidate;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import java.math.BigDecimal;
import java.util.List;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;

public record UpdateCandidateRequest(
        @Size(min = 1, message = "Le prénom ne peut pas être vide")
        String firstName,
        
        @Size(min = 1, message = "Le nom ne peut pas être vide")
        String lastName,
        
        @Size(min = 1, message = "Le titre ne peut pas être vide")
        String headline,
        
        @Size(min = 1, message = "Le téléphone ne peut pas être vide")
        String phone,
        
        @Size(min = 1, message = "La ville ne peut pas être vide")
        String city,
        
        @Size(min = 1, message = "La bio ne peut pas être vide")
        String bio,
        
        @URL(message = "L'URL du CV doit être valide")
        @Size(min = 1, message = "L'URL du CV ne peut pas être vide")
        String cvUrl,
        
        @URL(message = "L'URL de la photo doit être valide")
        @Size(min = 1, message = "L'URL de la photo ne peut pas être vide")
        String photoUrl,
        
        @URL(message = "L'URL LinkedIn doit être valide")
        @Size(min = 1, message = "L'URL LinkedIn ne peut pas être vide")
        String linkedinUrl,
        
        @URL(message = "L'URL GitHub doit être valide")
        @Size(min = 1, message = "L'URL GitHub ne peut pas être vide")
        String githubUrl,
        
        @PositiveOrZero(message = "Les années d'expérience ne peuvent pas être négatives")
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
    @AssertTrue(message = "Le salaire minimum ne peut pas dépasser le salaire maximum")
    private boolean isSalaryRangeValid() {
        if (desiredSalaryMin == null || desiredSalaryMax == null) return true;
        return desiredSalaryMin.compareTo(desiredSalaryMax) <= 0;
    }

    @AssertTrue(message = "Le TJM minimum ne peut pas dépasser le TJM maximum")
    private boolean isTjmRangeValid() {
        if (desiredTjmMin == null || desiredTjmMax == null) return true;
        return desiredTjmMin.compareTo(desiredTjmMax) <= 0;
    }
}
