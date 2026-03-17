package uha.miage.backend.api.user;

import java.time.Instant;
import java.util.UUID;
import uha.miage.backend.domain.user.enums.UserRole;

public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        UserRole role,
        Boolean isActive,
        Instant createdAt) {
}
