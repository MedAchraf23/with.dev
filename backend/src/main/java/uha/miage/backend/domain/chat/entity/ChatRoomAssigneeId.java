package uha.miage.backend.domain.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomAssigneeId implements Serializable {

    @Column(name = "chat_room_id")
    private Long chatRoomId;

    @Column(name = "recruiter_id")
    private Long recruiterId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatRoomAssigneeId that = (ChatRoomAssigneeId) o;
        return Objects.equals(chatRoomId, that.chatRoomId)
                && Objects.equals(recruiterId, that.recruiterId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatRoomId, recruiterId);
    }
}
