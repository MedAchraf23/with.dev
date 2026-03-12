package uha.miage.backend.domain.onboarding.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "onboarding_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class OnboardingProgress {

    @EmbeddedId
    private OnboardingProgressId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("candidateOnboardingId")
    @JoinColumn(name = "candidate_onboarding_id", nullable = false)
    private CandidateOnboarding candidateOnboarding;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("stepId")
    @JoinColumn(name = "step_id", nullable = false)
    private OnboardingStep step;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private Instant completedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
