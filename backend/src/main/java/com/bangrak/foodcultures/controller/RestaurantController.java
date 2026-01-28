package com.bangrak.foodcultures.controller;

import com.bangrak.foodcultures.model.Restaurant;
import com.bangrak.foodcultures.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant createdRestaurant = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(createdRestaurant, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurant
    ) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurant);
        return ResponseEntity.ok(updatedRestaurant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<Restaurant> updatePinPosition(
            @PathVariable String id,
            @RequestBody PinPositionRequest request
    ) {
        Restaurant updatedRestaurant = restaurantService.updatePinPosition(id, request.getPinX(), request.getPinY());
        return ResponseEntity.ok(updatedRestaurant);
    }

    // Inner class for pin position update request
    public static class PinPositionRequest {
        private Double pinX;
        private Double pinY;

        public Double getPinX() {
            return pinX;
        }

        public void setPinX(Double pinX) {
            this.pinX = pinX;
        }

        public Double getPinY() {
            return pinY;
        }

        public void setPinY(Double pinY) {
            this.pinY = pinY;
        }
    }
}
