package uha.miage.backend.domain.job.entity;

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
public class JobOfferAssigneeId implements Serializable {

    @Column(name = "job_offer_id")
    private Long jobOfferId;

    @Column(name = "recruiter_id")
    private Long recruiterId;
}
