import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Restaurant } from '../../types';
import { Plus, Save, Edit2, Trash2, ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { DISTRICT_OPTIONS } from '../../constants/districts';
import { MapView } from '../Map/MapView';

type ViewMode = 'list' | 'edit-restaurant' | 'edit-pin';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  onSave: (restaurant: Restaurant) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdatePin?: (id: string, pinX: number, pinY: number) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants,
  onSave,
  onDelete,
  onUpdatePin,
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPinId, setEditingPinId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Restaurant>>({});
  const [previewPinPosition, setPreviewPinPosition] = useState<{ x: number; y: number } | null>(null);

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditForm(restaurant);
    setViewMode('edit-restaurant');
  };

  const handleEditPin = (restaurant: Restaurant) => {
    setEditingPinId(restaurant.id);
    setPreviewPinPosition({ x: restaurant.pinX, y: restaurant.pinY });
    setViewMode('edit-pin');
  };

  const handlePinPositionChange = (axis: 'x' | 'y', value: number) => {
    if (axis === 'x') {
      setPreviewPinPosition(prev => prev ? { ...prev, x: value } : { x: value, y: 50 });
    } else {
      setPreviewPinPosition(prev => prev ? { ...prev, y: value } : { x: 50, y: value });
    }
  };

  const handleSavePinPosition = async () => {
    console.log('[handleSavePinPosition] Called');
    console.log('[handleSavePinPosition] editingPinId:', editingPinId);
    console.log('[handleSavePinPosition] previewPinPosition:', previewPinPosition);

    if (!editingPinId || !previewPinPosition) {
      console.log('[handleSavePinPosition] Missing required data, returning');
      return;
    }

    const restaurant = restaurants.find(r => r.id === editingPinId);
    if (!restaurant) {
      console.log('[handleSavePinPosition] Restaurant not found, returning');
      return;
    }

    console.log('[handleSavePinPosition] Saving pin position for:', restaurant.nameTh);
    console.log('[handleSavePinPosition] New position - X:', previewPinPosition.x, 'Y:', previewPinPosition.y);

    try {
      // Use onUpdatePin if available (uses PATCH /{id}/pin), otherwise fallback to onSave (PUT /{id})
      if (onUpdatePin) {
        console.log('[handleSavePinPosition] Using onUpdatePin (PATCH endpoint)');
        await onUpdatePin(editingPinId, previewPinPosition.x, previewPinPosition.y);
      } else {
        console.log('[handleSavePinPosition] Using onSave (PUT endpoint) - fallback');
        // Update restaurant with new pin position
        const updatedRestaurant = {
          ...restaurant,
          pinX: previewPinPosition.x,
          pinY: previewPinPosition.y,
        };

        console.log('[handleSavePinPosition] Sending payload:', JSON.stringify(updatedRestaurant, null, 2));
        await onSave(updatedRestaurant);
      }
      console.log('[handleSavePinPosition] Saved successfully');
      handleBackToList();
    } catch (error) {
      console.error('[handleSavePinPosition] Error saving:', error);
      console.error('[handleSavePinPosition] Error details:', JSON.stringify(error, null, 2));
      alert('Failed to save pin position. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!editingId) return;

    // Validation for required fields
    const requiredFields = ['nameTh', 'descriptionTh', 'category', 'subDistrict', 'googleMapsUrl'];
    const missingFields = requiredFields.filter(field => {
      const value = editForm[field as keyof Restaurant];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      await onSave(editForm as Restaurant);
      setViewMode('list');
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to save restaurant:', error);
      alert('Failed to save restaurant. Please check your input and try again.');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingId(null);
    setEditingPinId(null);
    setEditForm({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
      await onDelete(id);
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setEditForm({
      id: 'new',
      nameTh: '',
      nameEn: '',
      descriptionTh: '',
      descriptionEn: '',
      category: 'thai_restaurant',
      subDistrict: 'silom',
      googleMapsUrl: '',
      pinX: 50.0,
      pinY: 50.0,
      healthFriendly: false,
      heritageRestaurant: false,
      imageUrl: undefined,
      imageUrls: null,
      address: '',
      latitude: undefined,
      longitude: undefined,
      licenseVolume: '',
      licenseNumber: '',
      licenseYear: '',
      licenseHolder: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setViewMode('edit-restaurant');
  };

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.title')}</h1>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#7F0303] text-white rounded-lg font-medium hover:bg-[#6a0202] transition-colors"
            >
              <Plus size={20} />
              {t('admin.addRestaurant')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'edit-restaurant' && (
          <>
            {/* Edit Restaurant Mode - Form Only */}
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('admin.cancel')}
            </button>

            {/* Edit Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                {editingId === 'new' ? t('admin.addRestaurant') : t('admin.editRestaurant')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (TH)
                  </label>
                  <input
                    type="text"
                    value={editForm.nameTh || ''}
                    onChange={(e) => setEditForm({ ...editForm, nameTh: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (EN)
                  </label>
                  <input
                    type="text"
                    value={editForm.nameEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (TH)
                  </label>
                  <textarea
                    value={editForm.descriptionTh || ''}
                    onChange={(e) => setEditForm({ ...editForm, descriptionTh: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (EN)
                  </label>
                  <textarea
                    value={editForm.descriptionEn || ''}
                    onChange={(e) => setEditForm({ ...editForm, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category || 'thai_restaurant'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-district
                  </label>
                  <select
                    value={editForm.subDistrict || 'silom'}
                    onChange={(e) => setEditForm({ ...editForm, subDistrict: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  >
                    {DISTRICT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={editForm.googleMapsUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, googleMapsUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  />
                </div>
                <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    📍 Pin Position
                  </p>
                  <p className="text-xs text-yellow-700">
                    Pin position can only be adjusted by clicking the "Edit Pin Position" button on the restaurant list. This separates location management from restaurant information.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Current position: X={editForm.pinX?.toFixed(1) || '50'}, Y={editForm.pinY?.toFixed(1) || '50'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images (Multiple URLs, one per line)
                  </label>
                  <textarea
                    value={editForm.imageUrls?.join('\n') || ''}
                    onChange={(e) => {
                      const urls = e.target.value.split('\n').filter(url => url.trim());
                      setEditForm({ ...editForm, imageUrls: urls.length > 0 ? urls : null });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                    rows={4}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                  {editForm.imageUrls && editForm.imageUrls.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {editForm.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = editForm.imageUrls?.filter((_, i) => i !== index) || [];
                              setEditForm({ ...editForm, imageUrls: newUrls.length > 0 ? newUrls : null });
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="health"
                    checked={editForm.healthFriendly || false}
                    onChange={(e) => setEditForm({ ...editForm, healthFriendly: e.target.checked })}
                    className="w-4 h-4 text-[#7F0303] focus:ring-[#7F0303]"
                  />
                  <label htmlFor="health" className="text-sm font-medium text-gray-700">
                    Health-friendly
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="heritage"
                    checked={editForm.heritageRestaurant || false}
                    onChange={(e) => setEditForm({ ...editForm, heritageRestaurant: e.target.checked })}
                    className="w-4 h-4 text-[#7F0303] focus:ring-[#7F0303]"
                  />
                  <label htmlFor="heritage" className="text-sm font-medium text-gray-700">
                    Heritage Restaurant
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-[#7F0303] text-white rounded-lg font-medium hover:bg-[#6a0202] transition-colors"
                >
                  <Save size={20} />
                  {t('admin.save')}
                </button>
                <button
                  onClick={handleBackToList}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </>
        )}

        {viewMode === 'edit-pin' && (
          <>
            {/* Edit Pin Mode - Input fields + Live Preview */}
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to List
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                Adjust Pin Position
              </h2>

              {/* Restaurant Info Card */}
              {(() => {
                const restaurant = restaurants.find(r => r.id === editingPinId);
                if (!restaurant) return null;

                return (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="flex gap-4">
                      {/* Restaurant Image */}
                      <div className="flex-shrink-0">
                        {restaurant.imageUrls && restaurant.imageUrls.length > 0 ? (
                          <img
                            src={restaurant.imageUrls[0]}
                            alt={restaurant.nameTh}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                          />
                        ) : restaurant.imageUrl ? (
                          <img
                            src={restaurant.imageUrl}
                            alt={restaurant.nameTh}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-2xl">📷</span>
                          </div>
                        )}
                      </div>

                      {/* Restaurant Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {restaurant.nameTh}
                        </h3>
                        {restaurant.nameEn && (
                          <p className="text-sm text-gray-600 truncate">
                            {restaurant.nameEn}
                          </p>
                        )}
                        <div className="mt-2 space-y-1">
                          {restaurant.descriptionTh && (
                            <p className="text-xs text-gray-700 line-clamp-2">
                              <span className="font-medium">📝 TH:</span> {restaurant.descriptionTh}
                            </p>
                          )}
                          {restaurant.descriptionEn && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              <span className="font-medium">📝 EN:</span> {restaurant.descriptionEn}
                            </p>
                          )}
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Category:</span> {restaurant.category}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Sub-district:</span> {restaurant.subDistrict}
                          </p>
                          {restaurant.googleMapsUrl && (
                            <p className="text-xs text-blue-600 truncate">
                              <span className="font-medium">📍</span>{' '}
                              <a
                                href={restaurant.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                View on Google Maps
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Pin Position Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X Position (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={previewPinPosition?.x.toFixed(1) || '50.0'}
                    onChange={(e) => handlePinPositionChange('x', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y Position (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={previewPinPosition?.y.toFixed(1) || '50.0'}
                    onChange={(e) => handlePinPositionChange('y', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7F0303]"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                💡 The pin on the map below updates in real-time as you adjust the values
              </p>

              {/* Map Section - For preview only */}
              <div className="w-full h-[500px] relative border-4 border-gray-200 rounded-lg overflow-hidden mb-6">
                <MapView
                  isAdmin={false}
                  editingRestaurantId={editingPinId}
                  previewPinPosition={previewPinPosition}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleSavePinPosition}
                  className="flex items-center gap-2 px-6 py-2 bg-[#7F0303] text-white rounded-lg font-medium hover:bg-[#6a0202] transition-colors"
                >
                  <Save size={20} />
                  Save Pin Position
                </button>
                {(() => {
                  const restaurant = restaurants.find(r => r.id === editingPinId);
                  return restaurant?.googleMapsUrl ? (
                    <button
                      onClick={() => window.open(restaurant.googleMapsUrl, '_blank')}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink size={20} />
                      Open in Google Maps
                    </button>
                  ) : null;
                })()}
                <button
                  onClick={handleBackToList}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {viewMode === 'list' && (
          <>
            {/* Restaurant List Mode - No Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-md p-4">
              {restaurant.imageUrls && restaurant.imageUrls.length > 0 ? (
                <div className="relative w-full h-32 mb-3">
                  <img
                    src={restaurant.imageUrls[0]}
                    alt={restaurant.nameTh}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {restaurant.imageUrls.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                      +{restaurant.imageUrls.length - 1}
                    </div>
                  )}
                </div>
              ) : restaurant.imageUrl && (
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.nameTh}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-bold text-gray-800 mb-1">{restaurant.nameTh}</h3>
              <p className="text-sm text-gray-600 mb-3">{restaurant.category}</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#96C0CE] text-white rounded-lg text-sm font-medium hover:bg-[#7aa8b7] transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit Info
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => handleEditPin(restaurant)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <MapPin size={16} />
                  Edit Pin Position
                </button>
              </div>
            </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
