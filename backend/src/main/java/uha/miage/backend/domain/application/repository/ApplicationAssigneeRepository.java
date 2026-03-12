package uha.miage.backend.domain.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.application.entity.ApplicationAssignee;
import uha.miage.backend.domain.application.entity.ApplicationAssigneeId;

@Repository
public interface ApplicationAssigneeRepository extends JpaRepository<ApplicationAssignee, ApplicationAssigneeId> {
}
