package uha.miage.backend.domain.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.ai.entity.AiRecommendation;

@Repository
public interface AiRecommendationRepository extends JpaRepository<AiRecommendation, Long> {
}
