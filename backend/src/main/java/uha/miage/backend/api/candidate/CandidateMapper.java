package uha.miage.backend.api.candidate;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uha.miage.backend.domain.user.entity.Candidate;

@Mapper(componentModel = "spring")
public interface CandidateMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isOpenToWork", defaultExpression = "java(true)")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Candidate toEntity(CreateCandidateRequest request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "user.email", target = "email")
    CandidateResponse toResponse(Candidate candidate);
}
