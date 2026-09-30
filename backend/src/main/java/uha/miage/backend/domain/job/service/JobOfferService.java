package uha.miage.backend.domain.job.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uha.miage.backend.core.exception.ResourceNotFoundException;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.job.entity.JobOffer;
import uha.miage.backend.domain.job.enums.JobOfferStatus;
import uha.miage.backend.domain.job.repository.JobOfferRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;

    public List<JobOffer> search(String search, String city, ContractType contractType, WorkMode workMode) {
        return jobOfferRepository.search(
                JobOfferStatus.PUBLISHED,
                blankToNull(search),
                blankToNull(city),
                contractType,
                workMode);
    }

    public JobOffer getPublishedById(Long id) {
        return jobOfferRepository.findByIdAndStatus(id, JobOfferStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Offre non trouvée"));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
