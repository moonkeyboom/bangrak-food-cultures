// Maintenance overlay component for temporary website maintenance mode
import React from 'react';
import { X } from 'lucide-react';

interface MaintenanceOverlayProps {
  onClose?: () => void;
}

export const MaintenanceOverlay: React.FC<MaintenanceOverlayProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      style={{
        width: '100vw',
        height: '100dvh',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
          aria-label="Close"
        >
          <X size={32} />
        </button>
      )}

      {/* Content Container */}
      <div className="text-center px-6 max-w-2xl">
        {/* Thai Content */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            เว็บไซต์กำลังปรับปรุง
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            ขออภัยในความไม่สะดวก
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-0.5 bg-white/30 mx-auto mb-8"></div>

        {/* English Content */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            This website is currently under maintenance
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            We apologize for the inconvenience
          </p>
        </div>

        {/* Close Button (Centered Alternative) */}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            ปิด / Close
          </button>
        )}
      </div>
    </div>
  );
};
