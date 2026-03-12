package uha.miage.backend.domain.job.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uha.miage.backend.domain.common.BaseEntity;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.ExperienceLevel;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.company.entity.Company;
import uha.miage.backend.domain.job.enums.JobOfferStatus;
import uha.miage.backend.domain.user.entity.Recruiter;

@Entity
@Table(name = "job_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class JobOffer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_recruiter_id", nullable = false)
    private Recruiter createdByRecruiter;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel;

    @Column(name = "salary_min", precision = 10, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 10, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "tjm_min", precision = 10, scale = 2)
    private BigDecimal tjmMin;

    @Column(name = "tjm_max", precision = 10, scale = 2)
    private BigDecimal tjmMax;

    @Column(length = 100)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", nullable = false)
    @Builder.Default
    private WorkMode workMode = WorkMode.HYBRID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobOfferStatus status = JobOfferStatus.DRAFT;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;
}
