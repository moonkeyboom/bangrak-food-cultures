import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Minus, RotateCw, Compass } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRotate: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onRotate,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2">
      <button
        onClick={onZoomIn}
        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={t('map.zoomIn')}
        title={t('map.zoomIn')}
      >
        <Plus size={20} className="text-gray-700" />
      </button>

      <button
        onClick={onZoomOut}
        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={t('map.zoomOut')}
        title={t('map.zoomOut')}
      >
        <Minus size={20} className="text-gray-700" />
      </button>

      <button
        onClick={onRotate}
        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={t('map.rotate')}
        title={t('map.rotate')}
      >
        <RotateCw size={20} className="text-gray-700" />
      </button>

      <button
        onClick={onReset}
        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={t('map.reset')}
        title={t('map.reset')}
      >
        <Compass size={20} className="text-gray-700" />
      </button>
    </div>
  );
};
