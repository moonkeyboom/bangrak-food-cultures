import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRestaurants } from '../../contexts/RestaurantContext';
import { Filter, X } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { DISTRICT_OPTIONS } from '../../constants/districts';
import type { RestaurantCategory, SubDistrict } from '../../types';

export const FilterPanel: React.FC = () => {
  const { t, language } = useLanguage();
  const { filter, setFilter } = useRestaurants();
  const [isOpen, setIsOpen] = useState(false);

  // Use category options from constants
  const categories = CATEGORY_OPTIONS.map((cat) => ({
    value: cat.value,
    label: language === 'th' ? cat.labelTh : cat.labelEn,
  }));

  // Use district options from constants
  const subDistricts = DISTRICT_OPTIONS.map((dist) => ({
    value: dist.value,
    label: language === 'th' ? dist.labelTh : dist.labelEn,
  }));

  const toggleCategory = (value: RestaurantCategory) => {
    setFilter((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  };

  const toggleSubDistrict = (value: SubDistrict) => {
    setFilter((prev) => ({
      ...prev,
      subDistricts: prev.subDistricts.includes(value)
        ? prev.subDistricts.filter((d) => d !== value)
        : [...prev.subDistricts, value],
    }));
  };

  const resetFilters = () => {
    setFilter({
      searchQuery: filter.searchQuery,
      categories: [],
      subDistricts: [],
    });
  };

  const hasActiveFilters =
    filter.categories.length > 0 ||
    filter.subDistricts.length > 0;

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          hasActiveFilters ? 'ring-2 ring-[#7F0303]' : ''
        }`}
        aria-label={t('nav.filter')}
      >
        <Filter size={20} className={hasActiveFilters ? 'text-[#7F0303]' : 'text-gray-700'} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div
          className="fixed inset-x-4 top-20 bottom-24 z-40 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-top duration-300"
          style={{
            touchAction: 'pan-y', // Allow only vertical scroll inside filter panel
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t('filter.title')}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('filter.category')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    filter.categories.includes(cat.value)
                      ? 'bg-[#7F0303] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-districts */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('filter.district')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {subDistricts.map((district) => (
                <button
                  key={district.value}
                  onClick={() => toggleSubDistrict(district.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    filter.subDistricts.includes(district.value)
                      ? 'bg-[#96C0CE] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {district.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              {t('filter.reset')}
            </button>
          )}
        </div>
      )}
    </>
  );
};
