package uha.miage.backend.api.user;

import org.mapstruct.Mapper;
import uha.miage.backend.domain.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
