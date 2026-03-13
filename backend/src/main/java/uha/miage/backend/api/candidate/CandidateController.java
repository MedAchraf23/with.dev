package uha.miage.backend.api.candidate;

import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uha.miage.backend.domain.user.entity.Candidate;
import uha.miage.backend.domain.user.service.CandidateService;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private final CandidateMapper candidateMapper;

    @PostMapping
    public ResponseEntity<CandidateResponse> create(
        JwtAuthenticationToken token,
        @Valid @RequestBody CreateCandidateRequest request
    ) {
        UUID userId = UUID.fromString(token.getToken().getSubject());
        Candidate candidate = candidateMapper.toEntity(request);
        Candidate saved = candidateService.create(candidate, userId, request.firstName(), request.lastName());
        return ResponseEntity.status(HttpStatus.CREATED).body(candidateMapper.toResponse(saved));
    }

    @GetMapping("/me")
    public ResponseEntity<CandidateResponse> getMe(JwtAuthenticationToken token) {
        UUID userId = UUID.fromString(token.getToken().getSubject());
        Candidate candidate = candidateService.getByUserId(userId);
        return ResponseEntity.ok(candidateMapper.toResponse(candidate));
    }
}
