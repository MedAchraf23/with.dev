package uha.miage.backend.domain.onboarding.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingProgressId implements Serializable {

    @Column(name = "candidate_onboarding_id")
    private Long candidateOnboardingId;

    @Column(name = "step_id")
    private Long stepId;
}
