package uha.miage.backend.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uha.miage.backend.domain.common.BaseEntity;
import uha.miage.backend.domain.common.converter.ContractTypeListConverter;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Candidate extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 255)
    private String headline;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String city;

    @Column(columnDefinition = "text")
    private String bio;

    @Column(name = "cv_url", columnDefinition = "text")
    private String cvUrl;

    @Column(name = "photo_url", columnDefinition = "text")
    private String photoUrl;

    @Column(name = "linkedin_url", columnDefinition = "text")
    private String linkedinUrl;

    @Column(name = "github_url", columnDefinition = "text")
    private String githubUrl;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "desired_salary_min", precision = 10, scale = 2)
    private BigDecimal desiredSalaryMin;

    @Column(name = "desired_salary_max", precision = 10, scale = 2)
    private BigDecimal desiredSalaryMax;

    @Column(name = "desired_tjm_min", precision = 10, scale = 2)
    private BigDecimal desiredTjmMin;

    @Column(name = "desired_tjm_max", precision = 10, scale = 2)
    private BigDecimal desiredTjmMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_work_mode")
    private WorkMode preferredWorkMode;

    @Convert(converter = ContractTypeListConverter.class)
    @Column(name = "preferred_contract_types")
    private List<ContractType> preferredContractTypes;

    @Column(name = "is_open_to_work", nullable = false)
    @Builder.Default
    private Boolean isOpenToWork = true;
}
