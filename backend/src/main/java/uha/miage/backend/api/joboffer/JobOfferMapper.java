package uha.miage.backend.api.joboffer;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uha.miage.backend.domain.job.entity.JobOffer;

@Mapper(componentModel = "spring")
public interface JobOfferMapper {

    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    @Mapping(source = "company.logoUrl", target = "companyLogoUrl")
    JobOfferResponse toResponse(JobOffer jobOffer);

    List<JobOfferResponse> toResponseList(List<JobOffer> jobOffers);
}
