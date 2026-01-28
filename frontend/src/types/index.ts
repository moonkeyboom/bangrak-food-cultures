export type RestaurantCategory =
  | 'cafe'
  | 'bar'
  | 'chinese_restaurant'
  | 'japanese_restaurant'
  | 'south_asian_restaurant'
  | 'western_restaurant'
  | 'vegetarian_restaurant'
  | 'halal_restaurant'
  | 'healthy_restaurant'
  | 'thai_restaurant';

export type SubDistrict =
  | 'maha_phruettharam'
  | 'silom'
  | 'suriyawong'
  | 'bang_rak'
  | 'si_phraya';

export type Language = 'th' | 'en';

export interface Restaurant {
  id: string;
  nameTh: string;
  nameEn?: string;
  descriptionTh: string;
  descriptionEn?: string;
  category: RestaurantCategory;
  subDistrict: SubDistrict;
  address?: string;
  googleMapsUrl: string;
  latitude?: number;
  longitude?: number;
  pinX: number; // X position on custom map (0-100 percentage)
  pinY: number; // Y position on custom map (0-100 percentage)
  imageUrl?: string; // Single image URL (legacy)
  imageUrls: string[] | null; // Multiple image URLs (new)
  healthFriendly: boolean;
  heritageRestaurant: boolean;
  licenseVolume?: string;
  licenseNumber?: string;
  licenseYear?: string;
  licenseHolder?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterState {
  searchQuery: string;
  categories: RestaurantCategory[];
  subDistricts: SubDistrict[];
}

export interface MapViewState {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  password?: string;
}
