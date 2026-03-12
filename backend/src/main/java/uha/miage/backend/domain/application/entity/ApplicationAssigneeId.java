package uha.miage.backend.domain.application.entity;

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
public class ApplicationAssigneeId implements Serializable {

    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "recruiter_id")
    private Long recruiterId;
}
