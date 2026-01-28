import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Restaurant } from '../../types';
import { X, MapPin, ChevronLeft, ChevronRight, Building, Leaf } from 'lucide-react';
import { getDistrictColor, getDistrictName, hexToRgba } from '../../constants/districts';
import { getCategoryName, getCategoryBgColor, getCategoryTextColor } from '../../constants/categories';


export const BottomSheet: React.FC = () => {
  const { t, language } = useLanguage();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bottomSheetRef = useRef<HTMLDivElement>(null);

  // Standard slide animation
  const slideUp = useCallback(() => {
    if (!bottomSheetRef.current) return;
    bottomSheetRef.current.style.transform = 'translateY(0)';
  }, []);

  const slideDown = useCallback((onComplete: () => void) => {
    if (!bottomSheetRef.current) return;
    bottomSheetRef.current.style.transform = 'translateY(100%)';
    bottomSheetRef.current.addEventListener('transitionend', () => onComplete(), { once: true });
  }, []);

  useEffect(() => {
    const handlePinClick = (e: CustomEvent<Restaurant>) => {
      setRestaurant(e.detail);
      setIsOpen(true);
      setCurrentImageIndex(0);
      setTimeout(slideUp, 50);
    };

    window.addEventListener('pin-click', handlePinClick as EventListener);
    return () => {
      window.removeEventListener('pin-click', handlePinClick as EventListener);
    };
  }, [slideUp]);

  const handleClose = () => {
    slideDown(() => setIsOpen(false));
  };

  const shouldShow = isOpen && restaurant !== null;
  // Convert single imageUrl to array for carousel compatibility
  const images = restaurant?.imageUrls || (restaurant?.imageUrl ? [restaurant.imageUrl] : []);

  return (
    <>
      {/* Standard overlay */}
      <div
        className="fixed inset-0 z-[110]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: shouldShow ? 1 : 0,
          pointerEvents: shouldShow ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-in-out',
        }}
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div
        ref={bottomSheetRef}
        className="fixed bottom-0 left-0 right-0 z-[110]"
        style={{
          transform: 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          pointerEvents: shouldShow ? 'auto' : 'none',
        }}
      >
        <div
          className="relative bg-white rounded-t-2xl shadow-2xl"
          style={{
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div
              className="w-10 h-1 bg-gray-300 rounded-full"
            />
          </div>



          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>

            {restaurant && (
                <div className="p-4">
                    {/* Restaurant name */}
                    <div className="mb-3 pr-8">
                        <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                            {restaurant.nameTh}
                        </h1>
                        {restaurant.nameEn && (
                            <p className="text-sm text-gray-600 mt-0.5">
                                {restaurant.nameEn}
                  </p>
                )}
              </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-5 mb-3">
                    {/* District tag */}
                    <div
                        className="px-3 py-1 text-sm font-medium rounded-full flex items-center"
                        style={{
                            color: getDistrictColor(restaurant.subDistrict),
                            backgroundColor: hexToRgba(getDistrictColor(restaurant.subDistrict), 0.15)
                        }}
                    >
                        {getDistrictName(restaurant.subDistrict, language)}
                    </div>

                    {/* Category tag */}
                    <div
                        className="px-3 py-1 text-sm font-medium rounded-full flex items-center"
                        style={{
                            color: getCategoryTextColor(restaurant.category),
                            backgroundColor: hexToRgba(getCategoryBgColor(restaurant.category), 0.3)
                        }}
                    >
                        {getCategoryName(restaurant.category, language)}
                    </div>
                </div>
                {/* Recommended section */}
                {(restaurant.healthFriendly || restaurant.heritageRestaurant) && (
                    <div className="flex flex-col gap-1.5 mb-3">
                        <div className="flex items-center gap-1.5 text-sm">
                            {restaurant.healthFriendly && (
                                <div className="flex items-center gap-1 text-medium text-green-700">
                                    <Leaf size={14} />
                                    <span>{t('restaurant.healthyRestaurant')}</span>
                                </div>
                            )}
                            {restaurant.heritageRestaurant && (
                                <div className="flex items-center gap-1 text-medium text-orange-700">
                                    <Building size={14} />
                                    <span>{t('restaurant.heritageRestaurant')}</span>
                                </div>
                            )}
                            <span className="text-gray-800 font-medium">
                      {t('restaurant.recommendedByCheewajit')}
                    </span>
                            <img
                                src="/assets/Cheewajit Logo.svg"
                                alt="Cheewajit"
                                className="w-16 h-6"
                            />
                            {/*</div>*/}

                            {/*<div className="flex gap-1.5">*/}

                        </div>
                    </div>
                )}


                {/* Image carousel */}
                {images.length > 0 && (
                    <div className="mb-4 relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
                        <div
                            className="flex h-full"
                            style={{
                                transform: `translateX(-${currentImageIndex * 100}%)`,
                                transition: 'transform 0.3s ease-out',
                            }}
                        >
                            {images.map((imageUrl, index) => (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt={`${restaurant.nameTh} - Photo ${index + 1}`}
                                    className="w-full h-full object-cover flex-shrink-0"
                                />
                            ))}
                        </div>

                        {images.length > 1 && (
                            <>
                                {/* Image counter */}
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                                    {currentImageIndex + 1} / {images.length}
                                </div>

                                {/* Navigation */}
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </div>
                )}
              {/* Description */}
              {restaurant.descriptionTh && (
                <div className="mb-4">
                  <p className="text-l text-gray-700 leading-relaxed">
                    {language === 'th' ? restaurant.descriptionTh : (restaurant.descriptionEn || restaurant.descriptionTh)}
                  </p>
                </div>
              )}

              {/* Google Maps button */}
              {restaurant.googleMapsUrl && (
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 text-white font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: '#7F0303' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#680202'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F0303'}
                >
                  <MapPin size={18} />
                  <span>{t('restaurant.openInGoogleMaps')}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};