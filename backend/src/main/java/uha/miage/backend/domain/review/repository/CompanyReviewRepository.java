package uha.miage.backend.domain.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.review.entity.CompanyReview;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, Long> {
}
