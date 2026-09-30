package uha.miage.backend.domain.job.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.instancio.Instancio;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uha.miage.backend.core.exception.ResourceNotFoundException;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.job.entity.JobOffer;
import uha.miage.backend.domain.job.enums.JobOfferStatus;
import uha.miage.backend.domain.job.repository.JobOfferRepository;

@ExtendWith(MockitoExtension.class)
class JobOfferServiceTest {

    @Mock
    private JobOfferRepository jobOfferRepository;

    @InjectMocks
    private JobOfferService jobOfferService;

    // ===== search =====

    @Test
    @DisplayName("Ne recherche que parmi les offres publiées")
    void search_quandAppel_alorsFiltreSurStatutPublished() {
        List<JobOffer> offers = List.of(Instancio.create(JobOffer.class));
        when(jobOfferRepository.search(JobOfferStatus.PUBLISHED, "java", "Mulhouse", ContractType.CDI, WorkMode.HYBRID))
                .thenReturn(offers);

        List<JobOffer> result = jobOfferService.search("java", "Mulhouse", ContractType.CDI, WorkMode.HYBRID);

        assertThat(result).isEqualTo(offers);
        verify(jobOfferRepository).search(JobOfferStatus.PUBLISHED, "java", "Mulhouse", ContractType.CDI, WorkMode.HYBRID);
    }

    @Test
    @DisplayName("Traite les critères vides comme absents")
    void search_quandCriteresVides_alorsTransmetNull() {
        when(jobOfferRepository.search(JobOfferStatus.PUBLISHED, null, null, null, null))
                .thenReturn(List.of());

        jobOfferService.search("   ", "", null, null);

        verify(jobOfferRepository).search(JobOfferStatus.PUBLISHED, null, null, null, null);
    }

    @Test
    @DisplayName("Supprime les espaces superflus des critères texte")
    void search_quandCriteresAvecEspaces_alorsTransmetValeursNettoyees() {
        when(jobOfferRepository.search(JobOfferStatus.PUBLISHED, "java", "Mulhouse", null, null))
                .thenReturn(List.of());

        jobOfferService.search("  java  ", "  Mulhouse  ", null, null);

        verify(jobOfferRepository).search(JobOfferStatus.PUBLISHED, "java", "Mulhouse", null, null);
    }

    // ===== getPublishedById =====

    @Test
    @DisplayName("Retourne l'offre quand elle existe et est publiée")
    void getPublishedById_quandOffrePubliee_alorsRetourneOffre() {
        JobOffer offer = Instancio.create(JobOffer.class);
        when(jobOfferRepository.findByIdAndStatus(1L, JobOfferStatus.PUBLISHED)).thenReturn(Optional.of(offer));

        JobOffer result = jobOfferService.getPublishedById(1L);

        assertThat(result).isEqualTo(offer);
    }

    @Test
    @DisplayName("Lève ResourceNotFoundException quand l'offre n'est pas publiée ou n'existe pas")
    void getPublishedById_quandOffreIntrouvable_alorsResourceNotFoundException() {
        when(jobOfferRepository.findByIdAndStatus(1L, JobOfferStatus.PUBLISHED)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobOfferService.getPublishedById(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Offre non trouvée");
    }
}
