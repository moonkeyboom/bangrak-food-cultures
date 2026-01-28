import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRestaurants } from '../../contexts/RestaurantContext';
import { Search } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const { t } = useLanguage();
  const { filter, setFilter } = useRestaurants();

  return (
    <div className="fixed top-4 left-4 right-4 z-40">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={filter.searchQuery}
          onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
          placeholder={t('nav.search')}
          className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7F0303] focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
};
