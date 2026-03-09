package uha.miage.backend.domain.company.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uha.miage.backend.domain.common.BaseEntity;
import uha.miage.backend.domain.company.enums.CompanySize;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "registration_number", unique = true, length = 50)
    private String registrationNumber;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "logo_url", columnDefinition = "text")
    private String logoUrl;

    @Column(columnDefinition = "text")
    private String website;

    @Column(length = 100)
    private String city;

    @Enumerated(EnumType.STRING)
    private CompanySize size;

    @Column(length = 100)
    private String sector;
}
