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
 * Convertisseur JWT personnalisé pour Spring Security.
 *
 * Rattache le compte Supabase porté par le jeton à l'utilisateur applicatif,
 * créé lors de sa première requête authentifiée, et expose son rôle sous forme
 * de GrantedAuthority. Tant que l'onboarding n'a pas eu lieu, le rôle est null
 * et aucune autorité n'est accordée.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserService userService;

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
