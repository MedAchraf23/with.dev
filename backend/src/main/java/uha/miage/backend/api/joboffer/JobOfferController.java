package uha.miage.backend.api.joboffer;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uha.miage.backend.domain.common.enums.ContractType;
import uha.miage.backend.domain.common.enums.WorkMode;
import uha.miage.backend.domain.job.service.JobOfferService;

@RestController
@RequestMapping("/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;
    private final JobOfferMapper jobOfferMapper;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<JobOfferResponse> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) ContractType contractType,
            @RequestParam(required = false) WorkMode workMode
    ) {
        return jobOfferMapper.toResponseList(jobOfferService.search(search, city, contractType, workMode));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public JobOfferResponse getById(@PathVariable Long id) {
        return jobOfferMapper.toResponse(jobOfferService.getPublishedById(id));
    }
}
