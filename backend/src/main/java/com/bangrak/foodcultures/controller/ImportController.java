package com.bangrak.foodcultures.controller;

import com.bangrak.foodcultures.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class ImportController {

    private final CsvImportService csvImportService;

    @PostMapping("/csv")
    public ResponseEntity<String> importFromCsv(@RequestBody String filePath) {
        try {
            csvImportService.importFromCsv(filePath);
            return ResponseEntity.ok("Data imported successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Import failed: " + e.getMessage());
        }
    }
}
