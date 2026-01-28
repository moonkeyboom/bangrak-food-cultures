-- Bangrak Food Cultures Database Schema

CREATE DATABASE IF NOT EXISTS bangrak_food_cultures;
USE bangrak_food_cultures;

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_th TEXT NOT NULL,
    description_en TEXT,
    category ENUM('CAFE', 'BAR', 'CHINESE_RESTAURANT', 'JAPANESE_RESTAURANT', 'SOUTH_ASIAN_RESTAURANT', 'WESTERN_RESTAURANT', 'VEGETARIAN_RESTAURANT', 'HALAL_RESTAURANT', 'HEALTHY_RESTAURANT', 'THAI_RESTAURANT') NOT NULL,
    sub_district ENUM('MAHA_PHRUETTHARAM', 'SILOM', 'SURIYAWONG', 'BANG_RAK', 'SI_PHRAYA') NOT NULL,
    address VARCHAR(500),
    google_maps_url VARCHAR(1000) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    pin_x DOUBLE NOT NULL,
    pin_y DOUBLE NOT NULL,
    image_url VARCHAR(1000),
    image_urls JSON,
    health_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    heritage_restaurant BOOLEAN NOT NULL DEFAULT FALSE,
    license_volume VARCHAR(50),
    license_number VARCHAR(50),
    license_year VARCHAR(10),
    license_holder VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_sub_district (sub_district),
    INDEX idx_health_friendly (health_friendly),
    INDEX idx_heritage_restaurant (heritage_restaurant)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

