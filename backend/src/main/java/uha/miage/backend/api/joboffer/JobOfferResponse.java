package uha.miage.backend.api.joboffer;

import java.math.BigDecimal;
import java.time.Instant;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.ExperienceLevel;
import uha.miage.backend.domain.common.enums.WorkMode;

public record JobOfferResponse(
        Long id,
        String title,
        String description,
        ContractType contractType,
        ExperienceLevel experienceLevel,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        BigDecimal tjmMin,
        BigDecimal tjmMax,
        String city,
        WorkMode workMode,
        Instant publishedAt,
        Long companyId,
        String companyName,
        String companyLogoUrl
) {
}
