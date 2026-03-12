package uha.miage.backend.domain.user.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
}
