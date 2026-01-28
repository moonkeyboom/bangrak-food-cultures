package com.bangrak.foodcultures.service;

import com.bangrak.foodcultures.model.Restaurant;
import com.bangrak.foodcultures.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(String id, Restaurant restaurantDetails) {
        Restaurant restaurant = getRestaurantById(id);

        restaurant.setNameTh(restaurantDetails.getNameTh());
        restaurant.setNameEn(restaurantDetails.getNameEn());
        restaurant.setDescriptionTh(restaurantDetails.getDescriptionTh());
        restaurant.setDescriptionEn(restaurantDetails.getDescriptionEn());
        restaurant.setCategory(restaurantDetails.getCategory());
        restaurant.setSubDistrict(restaurantDetails.getSubDistrict());
        restaurant.setAddress(restaurantDetails.getAddress());
        restaurant.setGoogleMapsUrl(restaurantDetails.getGoogleMapsUrl());
        restaurant.setLatitude(restaurantDetails.getLatitude());
        restaurant.setLongitude(restaurantDetails.getLongitude());
        restaurant.setPinX(restaurantDetails.getPinX());
        restaurant.setPinY(restaurantDetails.getPinY());
        restaurant.setImageUrl(restaurantDetails.getImageUrl());
        restaurant.setImageUrls(restaurantDetails.getImageUrls());
        restaurant.setHealthFriendly(restaurantDetails.getHealthFriendly());
        restaurant.setHeritageRestaurant(restaurantDetails.getHeritageRestaurant());
        restaurant.setLicenseVolume(restaurantDetails.getLicenseVolume());
        restaurant.setLicenseNumber(restaurantDetails.getLicenseNumber());
        restaurant.setLicenseYear(restaurantDetails.getLicenseYear());
        restaurant.setLicenseHolder(restaurantDetails.getLicenseHolder());

        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(String id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurantRepository.delete(restaurant);
    }

    public Restaurant updatePinPosition(String id, Double pinX, Double pinY) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setPinX(pinX);
        restaurant.setPinY(pinY);
        return restaurantRepository.save(restaurant);
    }
}
