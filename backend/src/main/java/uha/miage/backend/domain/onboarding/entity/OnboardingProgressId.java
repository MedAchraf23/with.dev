package uha.miage.backend.domain.onboarding.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingProgressId implements Serializable {

    @Column(name = "candidate_onboarding_id")
    private Long candidateOnboardingId;

    @Column(name = "step_id")
    private Long stepId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OnboardingProgressId that = (OnboardingProgressId) o;
        return Objects.equals(candidateOnboardingId, that.candidateOnboardingId)
                && Objects.equals(stepId, that.stepId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(candidateOnboardingId, stepId);
    }
}
