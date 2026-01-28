import type { SubDistrict } from '../types';

/**
 * Mapping สีของแขวง (Sub-district Colors)
 *
 * ใช้สำหรับ District Tag ใน Bottom Sheet
 */
export const DISTRICT_COLORS: Record<SubDistrict, string> = {
  maha_phruettharam: '#009B0F',
  silom: '#CD00FF',
  suriyawong: '#2FEAB0',
  bang_rak: '#3F3BED',
  si_phraya: '#F22C65',
};

/**
 * ชื่อแขวงภาษาไทย
 */
export const DISTRICT_NAMES_TH: Record<SubDistrict, string> = {
  maha_phruettharam: 'มหาพฤฒาราม',
  silom: 'สีลม',
  suriyawong: 'สุริยวงศ์',
  bang_rak: 'บางรัก',
  si_phraya: 'สี่พระยา',
};

/**
 * ชื่อแขวงภาษาอังกฤษ
 */
export const DISTRICT_NAMES_EN: Record<SubDistrict, string> = {
  maha_phruettharam: 'Maha Phruettharam',
  silom: 'Silom',
  suriyawong: 'Suriyawong',
  bang_rak: 'Bang Rak',
  si_phraya: 'Si Phraya',
};

/**
 * รายการแขวงทั้งหมดสำหรับใช้ใน Filter และ Form
 */
export const DISTRICT_OPTIONS: Array<{
  value: SubDistrict;
  labelTh: string;
  labelEn: string;
}> = [
  { value: 'maha_phruettharam', labelTh: 'มหาพฤฒาราม', labelEn: 'Maha Phruettharam' },
  { value: 'silom', labelTh: 'สีลม', labelEn: 'Silom' },
  { value: 'suriyawong', labelTh: 'สุริยวงศ์', labelEn: 'Suriyawong' },
  { value: 'bang_rak', labelTh: 'บางรัก', labelEn: 'Bang Rak' },
  { value: 'si_phraya', labelTh: 'สี่พระยา', labelEn: 'Si Phraya' },
];

/**
 * Helper function: ดึงสีของแขวง
 */
export function getDistrictColor(subDistrict: SubDistrict): string {
  return DISTRICT_COLORS[subDistrict];
}

/**
 * Helper function: ดึงชื่อแขวงตามภาษา
 */
export function getDistrictName(subDistrict: SubDistrict, language: 'th' | 'en'): string {
  return language === 'th' ? DISTRICT_NAMES_TH[subDistrict] : DISTRICT_NAMES_EN[subDistrict];
}

/**
 * Helper function: แปลงสี hex เป็น rgba พร้อมความโปร่งแสง
 * @param hex - สีในรูปแบบ #RRGGBB
 * @param alpha - ค่าความโปร่งแสง (0-1)
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
