package uha.miage.backend.domain.document.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.document.entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
}
