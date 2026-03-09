package uha.miage.backend.domain.application.entity;

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
public class ApplicationAssigneeId implements Serializable {

    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "recruiter_id")
    private Long recruiterId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApplicationAssigneeId that = (ApplicationAssigneeId) o;
        return Objects.equals(applicationId, that.applicationId)
                && Objects.equals(recruiterId, that.recruiterId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(applicationId, recruiterId);
    }
}
