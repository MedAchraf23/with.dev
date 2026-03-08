package uha.miage.backend.api.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;

/**
 * 
 * Contrôleur exemple pour démontrer la gestion des rôles via Spring Security.
 *
 * 
 * 
 * Les routes sont protégées avec @PreAuthorize pour vérifier les rôles de
 * l'utilisateur.
 * 
 */

@RestController

@RequestMapping("/api/security-test")

@RequiredArgsConstructor

public class SecurityTestController {

    /**
     * 
     * Route accessible uniquement aux Recruteurs
     * 
     */

    @GetMapping("/recruiter-only")

    @PreAuthorize("hasRole('RECRUITER')")

    public String recruiterOnly(Authentication authentication) {

        return "Bienvenue Recruteur ! Votre identifiant: " + authentication.getName();

    }

    /**
     * 
     * Route accessible uniquement aux Candidats
     * 
     */

    @GetMapping("/candidate-only")

    @PreAuthorize("hasRole('CANDIDATE')")

    public String candidateOnly(Authentication authentication) {

        return "Bienvenue Candidat ! Votre identifiant: " + authentication.getName();

    }

    /**
     * 
     * Route accessible à tous les utilisateurs authentifiés
     * 
     * (avec n'importe quel rôle)
     * 
     */

    @GetMapping("/authenticated")

    public String onlyAuthenticated(Authentication authentication) {

        return "Vous êtes authentifié en tant que: " + authentication.getName() +

                " avec le rôle: " + authentication.getAuthorities();

    }

    /**
     * 
     * Route accessible uniquement aux Recruteurs ET Admins
     * 
     */

    @GetMapping("/admin-recruiter-area")

    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")

    public String adminOrRecruiter(Authentication authentication) {

        return "Zone pour Admins et Recruteurs. Utilisateur: " + authentication.getName();

    }

    /**
     * 
     * Endpoint de débogage pour inspecter un token brut (non sécurisé)
     * 
     */

    @GetMapping("/inspect-token")

    public String inspectToken(@RequestParam("token") String token) {

        try {

            String[] parts = token.split("\\.");

            if (parts.length < 2)
                return "Format de token invalide (besoin d'au moins 2 parties)";

            String header = new String(Base64.getUrlDecoder().decode(parts[0]));

            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));

            return "Header: " + header + "\n\nPayload: " + payload;

        } catch (Exception e) {

            return "Erreur lors du décodage du token: " + e.getMessage();

        }

    }

}