package uha.miage.backend.domain.common.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import uha.miage.backend.domain.common.enums.ContractType;

@Converter
public class ContractTypeListConverter implements AttributeConverter<List<ContractType>, String> {

    @Override
    public String convertToDatabaseColumn(List<ContractType> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        return attribute.stream()
                .map(ContractType::name)
                .collect(Collectors.joining(","));
    }

    @Override
    public List<ContractType> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(dbData.split(","))
                .map(String::trim)
                .map(ContractType::valueOf)
                .collect(Collectors.toList());
    }
}
