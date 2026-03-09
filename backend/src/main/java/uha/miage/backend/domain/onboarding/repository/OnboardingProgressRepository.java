package uha.miage.backend.domain.onboarding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.onboarding.entity.OnboardingProgress;
import uha.miage.backend.domain.onboarding.entity.OnboardingProgressId;

@Repository
public interface OnboardingProgressRepository extends JpaRepository<OnboardingProgress, OnboardingProgressId> {
}
