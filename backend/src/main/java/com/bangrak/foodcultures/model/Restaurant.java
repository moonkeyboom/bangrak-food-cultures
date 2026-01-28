package com.bangrak.foodcultures.model;

import com.bangrak.foodcultures.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nameTh;

    private String nameEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descriptionTh;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RestaurantCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubDistrict subDistrict;

    private String address;

    @Column(nullable = false)
    private String googleMapsUrl;

    private Double latitude;

    private Double longitude;

    @Column(name = "pin_x", nullable = false)
    private Double pinX;

    @Column(name = "pin_y", nullable = false)
    private Double pinY;

    private String imageUrl;

    @Column(columnDefinition = "JSON")
    @Convert(converter = StringListConverter.class)
    private List<String> imageUrls;

    @Column(nullable = false)
    private Boolean healthFriendly = false;

    @Column(nullable = false)
    private Boolean heritageRestaurant = false;

    private String licenseVolume;

    private String licenseNumber;

    private String licenseYear;

    private String licenseHolder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RestaurantCategory {
        CAFE,
        BAR,
        CHINESE_RESTAURANT,
        JAPANESE_RESTAURANT,
        SOUTH_ASIAN_RESTAURANT,
        WESTERN_RESTAURANT,
        VEGETARIAN_RESTAURANT,
        HALAL_RESTAURANT,
        HEALTHY_RESTAURANT,
        THAI_RESTAURANT
    }

    public enum SubDistrict {
        MAHA_PHRUETTHARAM,
        SILOM,
        SURIYAWONG,
        BANG_RAK,
        SI_PHRAYA
    }
}
