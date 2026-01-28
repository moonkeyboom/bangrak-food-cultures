package com.bangrak.foodcultures.repository;

import com.bangrak.foodcultures.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, String> {

    List<Restaurant> findByCategory(Restaurant.RestaurantCategory category);

    List<Restaurant> findBySubDistrict(Restaurant.SubDistrict subDistrict);

    List<Restaurant> findByCategoryAndSubDistrict(
        Restaurant.RestaurantCategory category,
        Restaurant.SubDistrict subDistrict
    );
}
