import type { Restaurant } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`;

export const api = {
  // Restaurants
  getRestaurants: async (): Promise<Restaurant[]> => {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    return response.json();
  },

  getRestaurant: async (id: string): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch restaurant');
    return response.json();
  },

  createRestaurant: async (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant),
    });
    if (!response.ok) throw new Error('Failed to create restaurant');
    return response.json();
  },

  updateRestaurant: async (id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant),
    });
    if (!response.ok) throw new Error('Failed to update restaurant');
    return response.json();
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete restaurant');
  },

  // Admin Authentication
  adminLogin: async (password: string): Promise<{ success: boolean; token?: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
  },

  verifyAdmin: async (token: string): Promise<{ valid: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to verify admin');
    return response.json();
  },
};
