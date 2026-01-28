package com.bangrak.foodcultures.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter(autoApply = false)
@Component
public class StringListConverter implements AttributeConverter<List<String>, String> {

    // Use a special delimiter that won't conflict with URLs
    private static final String DELIMITER = "|||";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            System.out.println("[StringListConverter] convertToDatabaseColumn: null or empty list, returning null");
            return null;
        }
        try {
            // Use Jackson to properly serialize as JSON array for MySQL JSON column
            String result = objectMapper.writeValueAsString(attribute);
            System.out.println("[StringListConverter] convertToDatabaseColumn: input list size=" + attribute.size());
            System.out.println("[StringListConverter] convertToDatabaseColumn: first element=" + attribute.get(0));
            System.out.println("[StringListConverter] convertToDatabaseColumn: output JSON string length=" + result.length());
            System.out.println("[StringListConverter] convertToDatabaseColumn: output=" + result);
            return result;
        } catch (JsonProcessingException e) {
            System.err.println("Failed to convert list to JSON: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            System.out.println("[StringListConverter] convertToEntityAttribute: null or empty input, returning empty list");
            return new ArrayList<>();
        }

        String data = dbData.trim();

        System.out.println("[StringListConverter] convertToEntityAttribute: input string length=" + data.length());
        System.out.println("[StringListConverter] convertToEntityAttribute: input=" + data);
        System.out.println("[StringListConverter] convertToEntityAttribute: starts with [ ? " + data.startsWith("["));

        // Handle JSON array format (primary format for MySQL JSON column)
        if (data.startsWith("[")) {
            try {
                List<String> result = objectMapper.readValue(data, new TypeReference<List<String>>() {});
                System.out.println("[StringListConverter] convertToEntityAttribute: JSON mode, result size=" + result.size());
                return result;
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse JSON array: " + data + ", error: " + e.getMessage());
                // Fallback to delimiter mode
            }
        }

        // Handle legacy delimiter-separated format (for backward compatibility)
        List<String> result = Arrays.stream(data.split("\\|\\|\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        System.out.println("[StringListConverter] convertToEntityAttribute: delimiter mode, result size=" + result.size());
        System.out.println("[StringListConverter] convertToEntityAttribute: first element=" + (result.isEmpty() ? "N/A" : result.get(0)));
        return result;
    }
}
