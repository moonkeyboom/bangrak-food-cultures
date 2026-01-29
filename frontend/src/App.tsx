import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { RestaurantProvider, useRestaurants } from './contexts/RestaurantContext';
import { LanguageSwitcher } from './components/Language/LanguageSwitcher';
import { MapView } from './components/Map/MapView';
import { SearchBar } from './components/Filter/SearchBar';
import { FilterPanel } from './components/Filter/FilterPanel';
import { BottomSheet } from './components/Restaurant/BottomSheet';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { MaintenanceOverlay } from './components/Maintenance/MaintenanceOverlay';
import { api } from './services/api';
import type { Restaurant } from './types';

// ============================================================
// MAINTENANCE MODE FLAG
// ============================================================
// Set this to true to enable maintenance mode overlay
// Set this to false to disable maintenance mode overlay
const MAINTENANCE_MODE = false;
// ============================================================

const AppContent: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [showMaintenanceOverlay, setShowMaintenanceOverlay] = useState(MAINTENANCE_MODE);
  const { restaurants, fetchRestaurants } = useRestaurants();

  // Check if current route is admin
  useEffect(() => {
    setIsAdminRoute(window.location.pathname === '/admin');
  }, []);

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleSaveRestaurant = async (restaurant: Restaurant): Promise<void> => {
    try {
      // Convert category and subDistrict to UPPERCASE for backend (for both create and update)
      const backendData = {
        ...restaurant,
        category: restaurant.category.toUpperCase() as any,
        subDistrict: restaurant.subDistrict.toUpperCase() as any,
      };

      if (restaurant.id === 'new') {
        // Remove id, createdAt, updatedAt when creating new restaurant
        const { id, createdAt, updatedAt, ...restaurantData } = backendData;
        await api.createRestaurant(restaurantData);
      } else {
        await api.updateRestaurant(restaurant.id, backendData);
      }
      await fetchRestaurants();
    } catch (error) {
      console.error('Failed to save restaurant:', error);
      throw error;
    }
  };

  const handleDeleteRestaurant = async (id: string): Promise<void> => {
    try {
      await api.deleteRestaurant(id);
      await fetchRestaurants();
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
      throw error;
    }
  };

  // Admin route - No login required
  if (isAdminRoute) {
    return (
      <AdminDashboard
        restaurants={restaurants}
        onSave={handleSaveRestaurant}
        onDelete={handleDeleteRestaurant}
      />
    );
  }

  // Main application
  return (
    <>
      {/* Maintenance Mode Overlay */}
      {showMaintenanceOverlay && (
        <MaintenanceOverlay onClose={() => setShowMaintenanceOverlay(false)} />
      )}

      <div
        className="relative no-scrollbar no-touch"
        style={{
          width: '100vw',
          // MOBILE-SAFE: Use 100dvh (dynamic viewport height) which excludes mobile browser toolbars
          // Fallback to 100vh for browsers that don't support dvh
          height: '100dvh',
          overflow: isAdminRoute ? 'auto' : 'hidden',
          position: isAdminRoute ? 'relative' : 'fixed',
          ...(!isAdminRoute && {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }),
        }}
      >
        {/* Main Map Area - fills entire viewport */}
        {!isAdminRoute && <MapView />}
        {!isAdminRoute && <SearchBar />}
        {!isAdminRoute && <FilterPanel />}
        {!isAdminRoute && <LanguageSwitcher />}
        {!isAdminRoute && <BottomSheet />}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <RestaurantProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/admin" element={<AppContent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RestaurantProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
