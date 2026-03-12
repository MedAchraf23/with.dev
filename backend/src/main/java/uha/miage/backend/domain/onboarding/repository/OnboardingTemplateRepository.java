package uha.miage.backend.domain.onboarding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.onboarding.entity.OnboardingTemplate;

@Repository
public interface OnboardingTemplateRepository extends JpaRepository<OnboardingTemplate, Long> {
}
