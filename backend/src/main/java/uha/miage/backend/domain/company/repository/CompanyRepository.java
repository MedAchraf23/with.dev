package uha.miage.backend.domain.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.company.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
}
