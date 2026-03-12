package uha.miage.backend.domain.job.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.job.entity.JobOfferAssignee;
import uha.miage.backend.domain.job.entity.JobOfferAssigneeId;

@Repository
public interface JobOfferAssigneeRepository extends JpaRepository<JobOfferAssignee, JobOfferAssigneeId> {
}
