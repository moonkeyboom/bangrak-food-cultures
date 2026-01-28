import React from 'react';
import type { Restaurant } from '../../types';
import { getCategoryPinPath } from '../../constants/categories';

interface PinProps {
  restaurant: Restaurant;
  x: number;
  y: number;
  isAdmin?: boolean;
  isDraggable?: boolean;
  onPinPositionChange?: (restaurantId: string, newX: number, newY: number) => void;
}

/**
 * Map Pin Component
 *
 * - หมุดถูกกำหนดจาก "ประเภทร้านอาหาร" เท่านั้น
 * - ใช้ mapping object กลาง (CATEGORY_PIN_MAP)
 * - ไม่มี if-else หรือ switch-case ซ้อน
 * - หมุดทุกประเภทมีขนาดเท่ากัน
 */
export const Pin: React.FC<PinProps> = ({
  restaurant,
  x,
  y,
  isAdmin = false,
  isDraggable = true,
  onPinPositionChange
}) => {
  // ดึง path ของ pin icon จาก category โดยตรง
  const pinPath = getCategoryPinPath(restaurant.category);

  const handleClick = () => {
    if (!isAdmin) {
      // Trigger bottom sheet
      window.dispatchEvent(new CustomEvent('pin-click', { detail: restaurant }));
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!isAdmin || !isDraggable) {
      e.preventDefault();
      return;
    }
    // Set drag image to be the pin itself
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', restaurant.id.toString());
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (!isAdmin || !isDraggable || !onPinPositionChange) return;

    // Calculate new position based on drop location
    // Use currentTarget (the div with the event listener) not target (the img element)
    const container = (e.currentTarget as HTMLElement).closest('[data-map-container]') as HTMLElement;
    if (!container) {
      console.error('Could not find map container');
      return;
    }

    const rect = container.getBoundingClientRect();
    const newX = ((e.clientX - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));

    console.log(`Updating pin ${restaurant.id} to position: ${clampedX.toFixed(2)}%, ${clampedY.toFixed(2)}%`);
    onPinPositionChange(restaurant.id, clampedX, clampedY);
  };

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-full ${
        isAdmin && isDraggable ? 'cursor-move' : 'cursor-pointer'
      } hover:scale-110 transition-transform`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: '16px',
        height: '16px',
      }}
      onClick={handleClick}
      draggable={isAdmin && isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <img
        src={pinPath}
        alt={`${restaurant.nameTh} pin`}
        className="w-full h-full drop-shadow-lg"
        draggable={false}
      />
    </div>
  );
};
