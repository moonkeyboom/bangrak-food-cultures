import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useRestaurants } from '../../contexts/RestaurantContext';
import { Pin } from './Pin';
import { MapControls } from './MapControls';
import { MapLoadingOverlay } from './MapLoadingOverlay';

interface MapViewProps {
  isAdmin?: boolean;
  editingRestaurantId?: string | null;
  previewPinPosition?: { x: number; y: number } | null;
}

export const MapView: React.FC<MapViewProps> = ({
  isAdmin = false,
  editingRestaurantId = null,
  previewPinPosition = null
}) => {
  const { filteredRestaurants, mapView, setMapView, updateRestaurantPin, isLoading } = useRestaurants();

  // State สำหรับติดตามว่า markers ถูก render แล้ว
  const [areMarkersRendered, setAreMarkersRendered] = useState(false);

  // Filter pins: if editing a restaurant, show only that pin
  const displayedRestaurants = React.useMemo(() => {
    let restaurants = filteredRestaurants;

    // Filter to show only the editing restaurant if specified
    if (isAdmin && editingRestaurantId) {
      restaurants = restaurants.filter(r => r.id === editingRestaurantId);
    }

    // If previewPinPosition is provided, override the pin position
    if (previewPinPosition && editingRestaurantId) {
      return restaurants.map(r =>
        r.id === editingRestaurantId
          ? { ...r, pinX: previewPinPosition.x, pinY: previewPinPosition.y }
          : r
      );
    }

    return restaurants;
  }, [filteredRestaurants, isAdmin, editingRestaurantId, previewPinPosition]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isBottomSheetAnimating, setIsBottomSheetAnimating] = useState(false);

  // MOBILE-SAFE: Use visualViewport API to get actual visible viewport
  const getViewportSize = useCallback(() => {
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  const [viewportSize, setViewportSize] = useState(getViewportSize());
  const [isMapReady, setIsMapReady] = useState(false);

  // MOBILE-SAFE: Update viewport size on visualViewport resize/orientation change
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize(getViewportSize());
    };

    // Listen to visualViewport resize (includes mobile browser toolbar toggle)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportSize);
      window.visualViewport.addEventListener('scroll', updateViewportSize);

      return () => {
        window.visualViewport!.removeEventListener('resize', updateViewportSize);
        window.visualViewport!.removeEventListener('scroll', updateViewportSize);
      };
    } else {
      // Fallback for browsers without visualViewport API
      window.addEventListener('resize', updateViewportSize);
      window.addEventListener('orientationchange', updateViewportSize);

      return () => {
        window.removeEventListener('resize', updateViewportSize);
        window.removeEventListener('orientationchange', updateViewportSize);
      };
    }
  }, [getViewportSize]);

  // PERF: Listen for bottom sheet animation events to disable map gestures
  useEffect(() => {
    const handleAnimationStart = () => {
      setIsBottomSheetAnimating(true);
    };

    const handleAnimationEnd = () => {
      setIsBottomSheetAnimating(false);
    };

    window.addEventListener('bottom-sheet-animation-start', handleAnimationStart);
    window.addEventListener('bottom-sheet-animation-end', handleAnimationEnd);

    return () => {
      window.removeEventListener('bottom-sheet-animation-start', handleAnimationStart);
      window.removeEventListener('bottom-sheet-animation-end', handleAnimationEnd);
    };
  }, []);

  // Direct update system for immediate response
  const targetRef = useRef({ x: 0, y: 0, scale: 1 });
  const currentRef = useRef({ x: 0, y: 0, scale: 1 });
  const rafRef = useRef<number | null>(null);

  // Map image dimensions (from SVG viewBox: 0 0 731 623)
  const mapImageWidth = 731;
  const mapImageHeight = 623;

  // Calculate the minimum scale using STRICT conditional logic
  // Rationale: Prefer fit-height, but NEVER allow map to be smaller than viewport width
  const calculateMinScale = useCallback(() => {
    // Compute both scales explicitly
    const scaleByHeight = viewportSize.height / mapImageHeight;
    const scaleByWidth = viewportSize.width / mapImageWidth;

    // INITIAL SCALE RULE (DO NOT SIMPLIFY):
    // Start with fit-height
    let initialScale = scaleByHeight;

    // IF AND ONLY IF map would be smaller than viewport width, use scaleByWidth
    if ((mapImageWidth * initialScale) < viewportSize.width) {
      initialScale = scaleByWidth;
    }

    return initialScale;
  }, [viewportSize]);

  // Calculate pan boundaries based on current scale
  // IMPORTANT: Clamp panning to map edges so empty space is never revealed
  const calculatePanBoundaries = useCallback((currentScale: number) => {
    // Calculate actual map dimensions at current scale
    const scaledMapWidth = mapImageWidth * currentScale;
    const scaledMapHeight = mapImageHeight * currentScale;

    // Calculate overflow beyond viewport in each dimension
    // Map is centered, so overflow is split on both sides
    const overflowX = Math.max(0, scaledMapWidth - viewportSize.width);
    const overflowY = Math.max(0, scaledMapHeight - viewportSize.height);

    // Maximum pan distance from center (half the overflow on each side)
    const maxPanX = overflowX / 2;
    const maxPanY = overflowY / 2;

    // Return boundaries that prevent map edges from passing viewport edges
    return {
      minX: -maxPanX,  // Can pan left to show right edge
      maxX: maxPanX,   // Can pan right to show left edge
      minY: -maxPanY,  // Can pan up to show bottom edge
      maxY: maxPanY,   // Can pan down to show top edge
    };
  }, [viewportSize, mapImageWidth, mapImageHeight]);

  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(targetRef.current.scale * 1.2, 5);

    // CRITICAL: Clamp scale FIRST, then compute boundaries for that scale
    const clampedScale = newScale;
    const boundaries = calculatePanBoundaries(clampedScale);

    // Direct update (no interpolation lag)
    targetRef.current.scale = clampedScale;
    // Re-clamp x and y based on new scale boundaries
    targetRef.current.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, targetRef.current.x));
    targetRef.current.y = Math.max(boundaries.minY, Math.min(boundaries.maxY, targetRef.current.y));

    // Immediately update current
    currentRef.current.scale = targetRef.current.scale;
    currentRef.current.x = targetRef.current.x;
    currentRef.current.y = targetRef.current.y;

    // Direct update via RAF
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMapView({
          positionX: currentRef.current.x,
          positionY: currentRef.current.y,
          scale: currentRef.current.scale,
          rotation: mapView.rotation,
        });
        rafRef.current = null;
      });
    }
  }, [calculatePanBoundaries, setMapView, mapView.rotation]);

  const handleZoomOut = useCallback(() => {
    const minScale = calculateMinScale();

    // HARD STOP: If already at min scale, ignore zoom-out input
    if (targetRef.current.scale <= minScale) {
      return;
    }

    // Calculate new scale and HARD clamp to minimum
    const newScale = Math.max(targetRef.current.scale / 1.2, minScale);

    // CRITICAL: Clamp scale FIRST, then compute boundaries for that scale
    const clampedScale = newScale;
    const boundaries = calculatePanBoundaries(clampedScale);

    // Direct update (no interpolation lag)
    targetRef.current.scale = clampedScale;
    // Re-clamp x and y based on new scale boundaries
    targetRef.current.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, targetRef.current.x));
    targetRef.current.y = Math.max(boundaries.minY, Math.min(boundaries.maxY, targetRef.current.y));

    // Immediately update current
    currentRef.current.scale = targetRef.current.scale;
    currentRef.current.x = targetRef.current.x;
    currentRef.current.y = targetRef.current.y;

    // Direct update via RAF
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMapView({
          positionX: currentRef.current.x,
          positionY: currentRef.current.y,
          scale: currentRef.current.scale,
          rotation: mapView.rotation,
        });
        rafRef.current = null;
      });
    }
  }, [calculateMinScale, calculatePanBoundaries, setMapView, mapView.rotation]);

  const handleReset = useCallback(() => {
    const minScale = calculateMinScale();

    // CRITICAL: Clamp scale FIRST, then compute boundaries
    const clampedScale = minScale;

    // Direct update (no interpolation lag) - reset to center (center is always valid)
    targetRef.current.scale = clampedScale;
    targetRef.current.x = 0;
    targetRef.current.y = 0;

    // Immediately update current
    currentRef.current.scale = clampedScale;
    currentRef.current.x = 0;
    currentRef.current.y = 0;

    // Direct update via RAF
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMapView({
          positionX: 0,
          positionY: 0,
          scale: clampedScale,
          rotation: 0,
        });
        rafRef.current = null;
      });
    }
  }, [calculateMinScale, setMapView]);

  const handleRotate = useCallback(() => {
    setMapView((prev) => ({ ...prev, rotation: prev.rotation + 90 }));
  }, []);

  // Touch/Mouse drag for panning with direct updates
  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // PERF: Disable map gestures during bottom sheet animation
    if (isAdmin || isBottomSheetAnimating) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  }, [isAdmin, isBottomSheetAnimating]);

  const handleDragMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || isAdmin) return;

    // Prevent default to stop page scrolling on touch
    if ('touches' in e) {
      e.preventDefault();
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // CRITICAL: Calculate boundaries based on CURRENT scale BEFORE updating position
    const boundaries = calculatePanBoundaries(targetRef.current.scale);

    // Direct update to TARGET for immediate response
    const newX = targetRef.current.x + deltaX;
    const newY = targetRef.current.y + deltaY;

    // Clamp TARGET to boundaries
    targetRef.current.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, newX));
    targetRef.current.y = Math.max(boundaries.minY, Math.min(boundaries.maxY, newY));

    // Immediately update current to match target (no interpolation lag)
    currentRef.current.x = targetRef.current.x;
    currentRef.current.y = targetRef.current.y;

    setDragStart({ x: clientX, y: clientY });

    // Trigger single RAF update for this frame
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMapView({
          positionX: currentRef.current.x,
          positionY: currentRef.current.y,
          scale: currentRef.current.scale,
          rotation: mapView.rotation,
        });
        rafRef.current = null;
      });
    }
  }, [isDragging, dragStart, isAdmin, calculatePanBoundaries, setMapView, mapView.rotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePinPositionChange = useCallback(async (restaurantId: string, newX: number, newY: number) => {
    // Disable drag when in preview mode
    if (!isAdmin || previewPinPosition) {
      console.warn('Pin position change ignored: Not in admin mode or in preview mode');
      return;
    }
    console.log(`handlePinPositionChange called: restaurantId=${restaurantId}, newX=${newX}, newY=${newY}`);
    try {
      await updateRestaurantPin(restaurantId, newX, newY);
      console.log('Successfully updated pin position');
    } catch (error) {
      console.error('Failed to update pin position:', error);
      alert('Failed to update pin position. Please try again.');
    }
  }, [isAdmin, previewPinPosition, updateRestaurantPin]);

  // Prevent scrolling on touch devices when dragging map
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDragging]);

  // Initialize map to fit viewport on mount
  // CRITICAL: Map must be hidden until scale & transform are ready
  // MOBILE-SAFE: Recalculate on viewport size change (rotation, toolbar toggle)
  useEffect(() => {
    const minScale = calculateMinScale();

    // Set both target and current to initial values
    targetRef.current = { x: 0, y: 0, scale: minScale };
    currentRef.current = { x: 0, y: 0, scale: minScale };

    // Apply scale immediately (before paint)
    setMapView({
      positionX: 0,
      positionY: 0,
      scale: minScale,
      rotation: 0,
    });

    // Make map visible AFTER scale is applied (next frame)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMapReady(true);
      });
    });
  }, [calculateMinScale, setMapView, viewportSize]); // Recalculate when viewport changes

  // Track markers rendering state
  // Overlay ต้องหายเมื่อทั้ง isLoading และ areMarkersRendered เป็น true
  useEffect(() => {
    // เมื่อไม่ได้โหลดแล้ว markers ควรจะ render แล้ว
    if (!isLoading && !areMarkersRendered && displayedRestaurants.length > 0) {
      // ใช้ requestAnimationFrame เพื่อให้ markers render ทันก่อนตั้งค่า
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAreMarkersRendered(true);
        });
      });
    }

    // Reset เมื่อเริ่มโหลดใหม่
    if (isLoading) {
      setAreMarkersRendered(false);
    }
  }, [isLoading, displayedRestaurants.length, areMarkersRendered]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loading Overlay - แสดงเมื่อกำลังโหลดหรือ markers ยังไม่ render ครบ */}
      <MapLoadingOverlay visible={isLoading || !areMarkersRendered} />

      <div
        ref={mapRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onWheel={(e) => {
          // PERF: Disable map zoom during bottom sheet animation
          if (isBottomSheetAnimating) return;
          e.preventDefault();
          if (e.deltaY < 0) {
            handleZoomIn();
          } else {
            handleZoomOut();
          }
        }}
      >
        <div
          className="absolute"
          style={{
            // Use translate3d for GPU acceleration
            transform: `translate3d(calc(-50% + ${mapView.positionX}px), calc(-50% + ${mapView.positionY}px), 0) scale(${mapView.scale})`,
            transition: isDragging
              ? 'none'
              : 'transform 0.3s ease-out, opacity 0.2s ease-in',
            transformOrigin: 'center center',
            width: `${mapImageWidth}px`,
            height: `${mapImageHeight}px`,
            left: '50%',
            top: '50%',
            willChange: isDragging ? 'transform' : 'auto',
            // CRITICAL: Hide map until scale is calculated to prevent flash
            opacity: isMapReady ? 1 : 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/assets/map/Map_Final_DistortText 2.svg")',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {/* Pins overlay */}
          <div
            data-map-container
            className="absolute"
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {displayedRestaurants.map((restaurant) => (
              <Pin
                key={restaurant.id}
                restaurant={restaurant}
                x={restaurant.pinX}
                y={restaurant.pinY}
                isAdmin={isAdmin}
                isDraggable={isAdmin && !previewPinPosition}
                onPinPositionChange={handlePinPositionChange}
              />
            ))}
          </div>
        </div>
      </div>

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onRotate={handleRotate}
      />
    </div>
  );
};
