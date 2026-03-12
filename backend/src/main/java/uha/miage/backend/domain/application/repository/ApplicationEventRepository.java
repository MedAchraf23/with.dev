package uha.miage.backend.domain.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.application.entity.ApplicationEvent;

@Repository
public interface ApplicationEventRepository extends JpaRepository<ApplicationEvent, Long> {
}
