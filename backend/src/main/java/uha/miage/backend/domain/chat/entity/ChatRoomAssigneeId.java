package uha.miage.backend.domain.chat.entity;

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
public class ChatRoomAssigneeId implements Serializable {

    @Column(name = "chat_room_id")
    private Long chatRoomId;

    @Column(name = "recruiter_id")
    private Long recruiterId;
}
