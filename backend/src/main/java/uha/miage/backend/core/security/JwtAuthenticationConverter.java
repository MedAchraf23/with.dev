package uha.miage.backend.core.security;

import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import uha.miage.backend.domain.user.entity.User;
import uha.miage.backend.domain.user.service.UserService;

import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

/**
 * Turns a verified Supabase JWT into Spring Security's authentication object.
 * Links the token to the application user (created on first request) and exposes
 * their role as an authority. Before onboarding the role is null, so no authority
 * is granted.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserService userService;

    /** Reads the user id and email from the token, provisions the user, and attaches their role (if any). */
    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        User user = userService.getOrCreate(userId, jwt.getClaimAsString("email"));

        Collection<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        return new JwtAuthenticationToken(jwt, authorities, user.getEmail());
    }
}
