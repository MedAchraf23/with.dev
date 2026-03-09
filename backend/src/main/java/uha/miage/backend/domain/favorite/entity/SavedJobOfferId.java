package uha.miage.backend.domain.favorite.entity;

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
public class SavedJobOfferId implements Serializable {

    @Column(name = "candidate_id")
    private Long candidateId;

    @Column(name = "job_offer_id")
    private Long jobOfferId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SavedJobOfferId that = (SavedJobOfferId) o;
        return Objects.equals(candidateId, that.candidateId)
                && Objects.equals(jobOfferId, that.jobOfferId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(candidateId, jobOfferId);
    }
}
