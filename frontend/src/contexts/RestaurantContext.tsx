import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Restaurant, FilterState, MapViewState } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`;

// Normalize backend format to frontend format
function normalizeRestaurant(backendRestaurant: any): Restaurant {
  return {
    ...backendRestaurant,
    id: String(backendRestaurant.id),
    // Convert backend enum (UPPERCASE) to frontend type (lowercase)
    category: backendRestaurant.category.toLowerCase() as Restaurant['category'],
    subDistrict: backendRestaurant.subDistrict.toLowerCase() as Restaurant['subDistrict'],
    pinX: backendRestaurant.pinX ?? 50,
    pinY: backendRestaurant.pinY ?? 50,
    createdAt: new Date(backendRestaurant.createdAt),
    updatedAt: new Date(backendRestaurant.updatedAt),
    // Handle imageUrls: if it exists use it, otherwise create array from imageUrl if present
    imageUrls: backendRestaurant.imageUrls || (backendRestaurant.imageUrl ? [backendRestaurant.imageUrl] : undefined),
  };
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  filter: FilterState;
  setFilter: (filter: FilterState | ((prev: FilterState) => FilterState)) => void;
  mapView: MapViewState;
  setMapView: (view: MapViewState | ((prev: MapViewState) => MapViewState)) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  isLoading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
  updateRestaurantPin: (id: string, pinX: number, pinY: number) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const initialFilter: FilterState = {
  searchQuery: '',
  categories: [],
  subDistricts: [],
};

const initialMapView: MapViewState = {
  scale: 1,
  positionX: 0,
  positionY: 0,
  rotation: 0,
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [mapView, setMapView] = useState<MapViewState>(initialMapView);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants`);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      // Normalize backend format to frontend format
      const normalizedData = data.map(normalizeRestaurant);
      setRestaurants(normalizedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRestaurantPin = useCallback(async (id: string, pinX: number, pinY: number) => {
    console.log(`updateRestaurantPin called: id=${id}, pinX=${pinX}, pinY=${pinY}`);
    setIsLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/restaurants/${id}/pin`;
      console.log(`Fetching: ${url}`);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pinX, pinY }),
      });
      console.log(`Response status: ${response.status}, ok: ${response.ok}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Failed to update pin position: ${response.status} ${errorText}`);
      }

      const updatedRestaurant = await response.json();
      console.log('Updated restaurant:', updatedRestaurant);
      const normalizedRestaurant = normalizeRestaurant(updatedRestaurant);

      // Update local state
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? normalizedRestaurant : r))
      );
      console.log('Local state updated successfully');
    } catch (err) {
      console.error('Error in updateRestaurantPin:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err; // Re-throw to allow component to handle error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter restaurants based on filter state
  const filteredRestaurants = React.useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesSearch =
          restaurant.nameTh.toLowerCase().includes(query) ||
          (restaurant.nameEn && restaurant.nameEn.toLowerCase().includes(query)) ||
          restaurant.descriptionTh.toLowerCase().includes(query) ||
          (restaurant.descriptionEn && restaurant.descriptionEn.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Categories
      if (filter.categories.length > 0 && !filter.categories.includes(restaurant.category)) {
        return false;
      }

      // Sub-districts
      if (filter.subDistricts.length > 0 && !filter.subDistricts.includes(restaurant.subDistrict)) {
        return false;
      }

      return true;
    });
  }, [restaurants, filter]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        filteredRestaurants,
        filter,
        setFilter,
        mapView,
        setMapView,
        selectedRestaurant,
        setSelectedRestaurant,
        isLoading,
        error,
        fetchRestaurants,
        updateRestaurantPin,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurants must be used within RestaurantProvider');
  }
  return context;
};
