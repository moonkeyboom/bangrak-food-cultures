import type { RestaurantCategory } from '../types';

/**
 * Mapping ระหว่างประเภทร้านอาหารกับ Pin Icon
 *
 * หมุดทุกประเภทมีขนาดเท่ากัน ไม่มีการ scale แยก
 */
export const CATEGORY_PIN_MAP: Record<RestaurantCategory, string> = {
  cafe: '/assets/pins/Pin_Cafe.png',
  bar: '/assets/pins/Pin_Bar.png',
  chinese_restaurant: '/assets/pins/Pin_Restaurant_Chinese.png',
  japanese_restaurant: '/assets/pins/Pin_Restaurant_Japanese.png',
  south_asian_restaurant: '/assets/pins/Pin_Restaurant_SouthAsian.png',
  western_restaurant: '/assets/pins/Pin_Restaurant_Western.png',
  vegetarian_restaurant: '/assets/pins/Pin_Restaurant_Vegan.png',
  halal_restaurant: '/assets/pins/Pin_Restaurant_Halal.png',
  healthy_restaurant: '/assets/pins/Pin_Restaurant_Healthy.png',
  thai_restaurant: '/assets/pins/Pin_Restaurant_Thai.png',
};

/**
 * สีพื้นหลังสำหรับ Category Tag (ตรงกับสีของ Pin)
 */
export const CATEGORY_BG_COLORS: Record<RestaurantCategory, string> = {
  bar: '#cea9e6',
  cafe: '#d7b29a',
  chinese_restaurant: '#e3c79b',
  halal_restaurant: '#e5cda3',
  healthy_restaurant: '#8ac6ca',
  japanese_restaurant: '#DA9D9F',
  south_asian_restaurant: '#A4E2D2',
  thai_restaurant: '#8FB5D3',
  vegetarian_restaurant: '#A3BF99',
  western_restaurant: '#DDB0C2',
};

/**
 * สีตัวอักษรสำหรับ Category Tag (ตรงกับสีของ Pin)
 */
export const CATEGORY_TEXT_COLORS: Record<RestaurantCategory, string> = {
  bar: '#A63D5D',
  cafe: '#AC3A28',
  chinese_restaurant: '#866226',
  halal_restaurant: '#427B2F',
  healthy_restaurant: '#1D5E61',
  japanese_restaurant: '#702B2D',
  south_asian_restaurant: '#214E42',
  thai_restaurant: '#1B4A6E',
  vegetarian_restaurant: '#355229',
  western_restaurant: '#7A4459',
};

/**
 * ชื่อประเภทร้านอาหารภาษาไทย
 */
export const CATEGORY_NAMES_TH: Record<RestaurantCategory, string> = {
  cafe: 'คาเฟ่',
  bar: 'บาร์',
  chinese_restaurant: 'ร้านอาหารจีน',
  japanese_restaurant: 'ร้านอาหารญี่ปุ่น',
  south_asian_restaurant: 'ร้านอาหารเอเชียใต้',
  western_restaurant: 'ร้านอาหารตะวันตก',
  vegetarian_restaurant: 'ร้านอาหารมังสวิรัติ',
  halal_restaurant: 'ร้านอาหารฮาลาล',
  healthy_restaurant: 'ร้านอาหารสุขภาพ',
  thai_restaurant: 'ร้านอาหารไทย',
};

/**
 * ชื่อประเภทร้านอาหารภาษาอังกฤษ
 */
export const CATEGORY_NAMES_EN: Record<RestaurantCategory, string> = {
  cafe: 'Cafe',
  bar: 'Bar',
  chinese_restaurant: 'Chinese Restaurant',
  japanese_restaurant: 'Japanese Restaurant',
  south_asian_restaurant: 'South Asian Restaurant',
  western_restaurant: 'Western Restaurant',
  vegetarian_restaurant: 'Vegetarian Restaurant',
  halal_restaurant: 'Halal Restaurant',
  healthy_restaurant: 'Healthy Food Restaurant',
  thai_restaurant: 'Thai Restaurant',
};

/**
 * รายการประเภทร้านอาหารทั้งหมดสำหรับใช้ใน Filter และ Form
 */
export const CATEGORY_OPTIONS: Array<{
  value: RestaurantCategory;
  labelTh: string;
  labelEn: string;
}> = [
  { value: 'cafe', labelTh: 'คาเฟ่', labelEn: 'Cafe' },
  { value: 'bar', labelTh: 'บาร์', labelEn: 'Bar' },
  { value: 'chinese_restaurant', labelTh: 'ร้านอาหารจีน', labelEn: 'Chinese Restaurant' },
  { value: 'japanese_restaurant', labelTh: 'ร้านอาหารญี่ปุ่น', labelEn: 'Japanese Restaurant' },
  { value: 'south_asian_restaurant', labelTh: 'ร้านอาหารเอเชียใต้', labelEn: 'South Asian Restaurant' },
  { value: 'western_restaurant', labelTh: 'ร้านอาหารตะวันตก', labelEn: 'Western Restaurant' },
  { value: 'vegetarian_restaurant', labelTh: 'ร้านอาหารมังสวิรัติ', labelEn: 'Vegetarian Restaurant' },
  { value: 'halal_restaurant', labelTh: 'ร้านอาหารฮาลาล', labelEn: 'Halal Restaurant' },
  { value: 'healthy_restaurant', labelTh: 'ร้านอาหารสุขภาพ', labelEn: 'Healthy Food Restaurant' },
  { value: 'thai_restaurant', labelTh: 'ร้านอาหารไทย', labelEn: 'Thai Restaurant' },
];

/**
 * Helper function: ดึง path ของ pin icon จาก category
 */
export function getCategoryPinPath(category: RestaurantCategory): string {
  return CATEGORY_PIN_MAP[category];
}

/**
 * Helper function: ดึงชื่อ category ตามภาษา
 */
export function getCategoryName(category: RestaurantCategory, language: 'th' | 'en'): string {
  return language === 'th' ? CATEGORY_NAMES_TH[category] : CATEGORY_NAMES_EN[category];
}

/**
 * Helper function: ดึงสีพื้นหลังของ category
 */
export function getCategoryBgColor(category: RestaurantCategory): string {
  return CATEGORY_BG_COLORS[category];
}

/**
 * Helper function: ดึงสีตัวอักษรของ category
 */
export function getCategoryTextColor(category: RestaurantCategory): string {
  return CATEGORY_TEXT_COLORS[category];
}
