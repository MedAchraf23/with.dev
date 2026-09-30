package uha.miage.backend.domain.job.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.job.entity.JobOffer;
import uha.miage.backend.domain.job.enums.JobOfferStatus;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    Optional<JobOffer> findByIdAndStatus(Long id, JobOfferStatus status);

    @Query("""
            SELECT o FROM JobOffer o
            LEFT JOIN FETCH o.company
            WHERE o.status = :status
              AND (CAST(:search AS String) IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%')))
              AND (CAST(:city AS String) IS NULL OR LOWER(o.city) = LOWER(CAST(:city AS String)))
              AND (:contractType IS NULL OR o.contractType = :contractType)
              AND (:workMode IS NULL OR o.workMode = :workMode)
            ORDER BY o.publishedAt DESC
            """)
    List<JobOffer> search(
            @Param("status") JobOfferStatus status,
            @Param("search") String search,
            @Param("city") String city,
            @Param("contractType") ContractType contractType,
            @Param("workMode") WorkMode workMode);
}
