package uha.miage.backend.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.chat.entity.ChatRoomAssignee;
import uha.miage.backend.domain.chat.entity.ChatRoomAssigneeId;

@Repository
public interface ChatRoomAssigneeRepository extends JpaRepository<ChatRoomAssignee, ChatRoomAssigneeId> {
}
