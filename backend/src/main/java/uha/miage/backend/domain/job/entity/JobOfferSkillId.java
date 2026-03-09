package uha.miage.backend.domain.job.entity;

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
public class JobOfferSkillId implements Serializable {

    @Column(name = "job_offer_id")
    private Long jobOfferId;

    @Column(name = "skill_id")
    private Long skillId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobOfferSkillId that = (JobOfferSkillId) o;
        return Objects.equals(jobOfferId, that.jobOfferId)
                && Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(jobOfferId, skillId);
    }
}
