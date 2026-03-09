package uha.miage.backend.domain.skill.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.skill.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
}
