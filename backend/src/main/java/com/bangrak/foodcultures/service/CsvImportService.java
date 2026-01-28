package com.bangrak.foodcultures.service;

import com.bangrak.foodcultures.model.Restaurant;
import com.bangrak.foodcultures.repository.RestaurantRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CsvImportService {

    private final RestaurantRepository restaurantRepository;

    public void importFromCsv(String filePath) {
        try {
            CSVReader reader = new CSVReader(new FileReader(filePath));
            String[] line;
            List<Restaurant> restaurants = new ArrayList<>();

            // Skip header
            reader.readNext();

            int rowNumber = 1;
            while ((line = reader.readNext()) != null) {
                rowNumber++;
                try {
                    if (line.length < 10) {
                        log.warn("Skipping row {}: insufficient columns", rowNumber);
                        continue;
                    }

                    Restaurant restaurant = new Restaurant();

                    // Parse data from CSV columns - zone is always needed
                    String zone = line.length > 1 ? line[1] : "";

                    // License info - use safe access with defaults
                    String licenseVolume = line.length > 12 ? line[12] : "";
                    String licenseNumber = line.length > 13 ? line[13] : "";
                    String licenseYear = line.length > 14 ? line[14] : "";
                    String licenseHolder = line.length > 16 ? line[16] : "";

                    // Basic info - use safe access
                    String nameTh = line.length > 4 ? line[4] : "";
                    String location = line.length > 5 ? line[5] : "";
                    String link = line.length > 6 ? line[6] : "";
                    String type = line.length > 7 ? line[7] : "";
                    String notes = line.length > 10 ? line[10] : "";

                    restaurant.setNameTh(nameTh.trim());
                    restaurant.setDescriptionTh(notes.trim());
                    restaurant.setAddress(location.trim());
                    restaurant.setGoogleMapsUrl(link.trim());
                    restaurant.setLicenseVolume(licenseVolume.trim());
                    restaurant.setLicenseNumber(licenseNumber.trim());
                    restaurant.setLicenseYear(licenseYear.trim());
                    restaurant.setLicenseHolder(licenseHolder.trim());

                    // Map category (combined category + cuisine type)
                    String typeLower = type.toLowerCase();
                    String notesLower = notes.toLowerCase();

                    if (typeLower.contains("คาเฟ่") || typeLower.contains("cafe") ||
                        typeLower.contains("เบเกอรี่") || typeLower.contains("เครื่องดื่ม")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.CAFE);
                    } else if (typeLower.contains("บาร์") || typeLower.contains("bar")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.BAR);
                    } else if (notesLower.contains("ฮาลาล") || notesLower.contains("halal")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.HALAL_RESTAURANT);
                    } else if (notesLower.contains("มังสวิรัติ") || notesLower.contains("เพื่อสุขภาพ") ||
                               notesLower.contains("vegan") || notesLower.contains("vegetarian")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.VEGETARIAN_RESTAURANT);
                    } else if (notesLower.contains("สุขภาพ") || notesLower.contains("ออร์แกนิค") ||
                               notesLower.contains("organic") || notesLower.contains("healthy")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.HEALTHY_RESTAURANT);
                    } else if (typeLower.contains("อิตาเลี่ยน") || typeLower.contains("ฝรั่งเศส") ||
                               typeLower.contains("ยุโรป") || typeLower.contains("european") ||
                               notesLower.contains("italian") || notesLower.contains("french") ||
                               notesLower.contains("western")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.WESTERN_RESTAURANT);
                    } else if (typeLower.contains("ญี่ปุ่น") || typeLower.contains("japanese")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.JAPANESE_RESTAURANT);
                    } else if (typeLower.contains("จีน") || typeLower.contains("เกี๊ยว") ||
                               typeLower.contains("chinese")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.CHINESE_RESTAURANT);
                    } else if (typeLower.contains("อินเดีย") || typeLower.contains("เลบานอน") ||
                               typeLower.contains("indian") || typeLower.contains("lebanese")) {
                        restaurant.setCategory(Restaurant.RestaurantCategory.SOUTH_ASIAN_RESTAURANT);
                    } else {
                        // Default: Thai restaurant
                        restaurant.setCategory(Restaurant.RestaurantCategory.THAI_RESTAURANT);
                    }

                    // Map sub-district
                    String zoneLower = zone.toLowerCase();
                    if (zoneLower.contains("มหาพฤฒาราม")) {
                        restaurant.setSubDistrict(Restaurant.SubDistrict.MAHA_PHRUETTHARAM);
                    } else if (zoneLower.contains("สีลม")) {
                        restaurant.setSubDistrict(Restaurant.SubDistrict.SILOM);
                    } else if (zoneLower.contains("สุริยวงศ์")) {
                        restaurant.setSubDistrict(Restaurant.SubDistrict.SURIYAWONG);
                    } else if (zoneLower.contains("บางรัก")) {
                        restaurant.setSubDistrict(Restaurant.SubDistrict.BANG_RAK);
                    } else if (zoneLower.contains("สี่พระยา")) {
                        restaurant.setSubDistrict(Restaurant.SubDistrict.SI_PHRAYA);
                    } else {
                        restaurant.setSubDistrict(Restaurant.SubDistrict.SILOM); // Default
                    }

                    // Set default pin positions (will be adjusted by admin)
                    restaurant.setPinX(50.0);
                    restaurant.setPinY(50.0);

                    // Set heritage/health flags
                    restaurant.setHeritageRestaurant(
                        notes.contains("เก่าแก่") ||
                        notes.contains("ร้านเก่า") ||
                        notes.contains("ตำนาน") ||
                        notes.contains("เปิดมานาน")
                    );
                    restaurant.setHealthFriendly(
                        notes.contains("เพื่อสุขภาพ") ||
                        notes.contains("สุขภาพ") ||
                        notes.contains("ออร์แกนิค") ||
                        notes.contains("organic")
                    );

                    restaurants.add(restaurant);

                } catch (Exception e) {
                    log.error("Error parsing row {}: {}", rowNumber, e.getMessage());
                }
            }

            reader.close();

            // Save all restaurants
            restaurantRepository.saveAll(restaurants);
            log.info("Successfully imported {} restaurants from CSV", restaurants.size());

        } catch (Exception e) {
            log.error("Error importing CSV: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to import CSV: " + e.getMessage());
        }
    }
}
