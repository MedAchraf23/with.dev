package uha.miage.backend.domain.job.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uha.miage.backend.domain.common.enums.AssigneeRole;
import uha.miage.backend.domain.user.entity.Recruiter;
import uha.miage.backend.domain.user.entity.User;

@Entity
@Table(name = "job_offer_assignees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class JobOfferAssignee {

    @EmbeddedId
    private JobOfferAssigneeId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("jobOfferId")
    @JoinColumn(name = "job_offer_id", nullable = false)
    private JobOffer jobOffer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("recruiterId")
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AssigneeRole role = AssigneeRole.COLLABORATOR;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    private User assignedBy;

    @Column(columnDefinition = "text")
    private String note;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
