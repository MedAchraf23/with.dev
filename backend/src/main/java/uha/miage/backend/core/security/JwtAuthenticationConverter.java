package uha.miage.backend.core.security;

import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import uha.miage.backend.domain.entity.user.User;
import uha.miage.backend.domain.repository.user.UserRepository;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Convertisseur JWT personnalisé pour Spring Security.
 * 
 * Extrait le rôle de l'utilisateur depuis la base de données
 * et le transforme en GrantedAuthority pour Spring Security.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // Récupérer l'email depuis le token JWT
        // Supabase utilise généralement "email" comme claim
        String email = jwt.getClaimAsString("email");

        if (email == null || email.isEmpty()) {
            // Fallback sur le claim "sub" si "email" n'existe pas
            email = jwt.getSubject();
        }

        // Variable finale pour utilisation dans la lambda
        final String userEmail = email;

        // Récupérer l'utilisateur depuis la base de données
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé pour l'email: " + userEmail));

        // Créer la liste des autorités basées sur le rôle
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // Retourner un token d'authentification Spring Security
        return new JwtAuthenticationToken(jwt, authorities, userEmail);
    }
}
