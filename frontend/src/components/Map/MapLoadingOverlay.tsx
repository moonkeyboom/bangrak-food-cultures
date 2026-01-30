import React from 'react';

interface MapLoadingOverlayProps {
  visible: boolean;
}

/**
 * Map Loading Overlay Component
 *
 * แสดง overlay เมื่อกำลังโหลดร้านอาหารบนแผนที่
 * - คลุมพื้นที่แผนที่ทั้งหมด
 * - พื้นหลังโปร่งแสง (backdrop-blur)
 * - แสดง spinner และข้อความ
 * - รองรับ 2 ภาษา (TH/EN)
 * - ใช้สี theme: #D8BA98 (Tan), #0F414A (Midnight Blue), #EFE8DF (Alabaster)
 */
export const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({ visible }) => {
  // รองรับ 2 ภาษา - ใช้ภาษาไทยเป็นหลัก
  const message = 'กำลังโหลดร้านอาหาร...';

  if (!visible) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300"
      style={{
        // Fade animation
        animation: 'fadeIn 0.3s ease-in-out',
        // Midnight Blue background with transparency
        backgroundColor: 'rgba(15, 65, 74, 0.85)',
      }}
    >
      {/* Loading Content */}
      <div
        className="flex flex-col items-center gap-4 rounded-2xl px-8 py-6/"
        // className="flex flex-col items-center gap-4 rounded-2xl px-8 py-6 shadow-xl/"
        // style={{
        //   // Alabaster background
        //   backgroundColor: '#EFE8DF',
        // }}
      >
        {/* Spinner */}
        <div className="relative">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-solid"
            style={{
              // Tan color for spinner
              borderTopColor: '#D8BA98',
              borderRightColor: 'transparent',
              borderBottomColor: '#D8BA98',
              borderLeftColor: 'transparent',
            }}
          ></div>
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p
            className="text-lg font-medium"
            style={{
              // Tan color for text
              color: '#D8BA98',
            }}
          >
            {message}
          </p>
          <p
            className="mt-1 text-sm"
            style={{
              // Darker tan for subtitle
              color: '#C4A074',
            }}
          >
            กรุณารอสักครู่...
          </p>
        </div>
      </div>

      {/* Inline Styles for Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
