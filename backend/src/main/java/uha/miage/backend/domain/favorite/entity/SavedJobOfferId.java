package uha.miage.backend.domain.favorite.entity;

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
public class SavedJobOfferId implements Serializable {

    @Column(name = "candidate_id")
    private Long candidateId;

    @Column(name = "job_offer_id")
    private Long jobOfferId;
}
