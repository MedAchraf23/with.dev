package uha.miage.backend.api.user;

import java.util.UUID;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import uha.miage.backend.domain.user.entity.User;

import lombok.RequiredArgsConstructor;
import uha.miage.backend.domain.user.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor

public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public UserResponse getMe(JwtAuthenticationToken token) {
        UUID userId = UUID.fromString(token.getToken().getSubject());
        User user = userService.getById(userId);
        return userMapper.toResponse(user);
    }

}
