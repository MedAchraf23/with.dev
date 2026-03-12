package uha.miage.backend.domain.job.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.job.entity.JobOfferSkill;
import uha.miage.backend.domain.job.entity.JobOfferSkillId;

@Repository
public interface JobOfferSkillRepository extends JpaRepository<JobOfferSkill, JobOfferSkillId> {
}
