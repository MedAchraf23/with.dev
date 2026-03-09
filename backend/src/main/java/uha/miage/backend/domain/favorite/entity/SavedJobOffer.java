package uha.miage.backend.domain.favorite.entity;

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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uha.miage.backend.domain.job.entity.JobOffer;
import uha.miage.backend.domain.user.entity.Candidate;

@Entity
@Table(name = "saved_job_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class SavedJobOffer {

    @EmbeddedId
    private SavedJobOfferId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("candidateId")
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("jobOfferId")
    @JoinColumn(name = "job_offer_id", nullable = false)
    private JobOffer jobOffer;

    @CreatedDate
    @Column(name = "saved_at", nullable = false, updatable = false)
    private Instant savedAt;
}
