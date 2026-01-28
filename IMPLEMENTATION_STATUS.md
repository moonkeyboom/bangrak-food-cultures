# Bangrak Food Cultures - Implementation Status

## Completed Changes (as of current implementation)

### ✅ Frontend Changes

1. **Admin Route Fixed**
   - Changed from `/admin-secret-dashboard` to `/admin` (per SRS requirement)
   - Route is now accessible at the correct path

2. **Full Viewport Map Layout**
   - Removed header component that was taking up space
   - Map now fills entire viewport (100vw x 100vh)
   - No extra whitespace outside the map

3. **Map Image Path Fixed**
   - Updated to use correct SVG file: `/assets/map/Map_Final(1).svg`
   - Previous path was incorrect: `/assets/map/map.svg`

4. **Pin Component Enhanced**
   - Pins now use cuisine-specific images based on restaurant type:
     - `Pin_Cafe.png`
     - `Pin_Bar.png`
     - `Pin_Restaurant_Thai.png`
     - `Pin_Restaurant_Chinese.png`
     - `Pin_Restaurant_Japanese.png`
     - `Pin_Restaurant_SouthAsian.png`
     - `Pin_Restaurant_Western.png`
     - `Pin_Restaurant_Halal.png`
     - `Pin_Restaurant_Vegan.png`
     - `Pin_Restaurant_Healthy.png`
   - Pins maintain fixed size (no scaling on zoom)
   - Overlapping pins are allowed (no clustering)

5. **Bottom Sheet Component Updated**
   - Uses Alabaster background (#EFE8DF) as per SRS
   - Added district tag display
   - Added category tag display
   - Implemented image carousel with navigation
   - Description limited to 1-2 lines (line-clamp-2)
   - Uses SRS color palette:
     - Maroon (#7F0303) for primary button
     - Alabaster (#EFE8DF) for text
     - Light Blue (#96C0CE) for tags
     - Midnight Blue (#0F414A) for main text
   - Supports both single imageUrl and multiple imageUrls array
   - Language-aware (shows TH or EN description based on selected language)

6. **UI Components Repositioned**
   - Search bar: Top-left, below viewport edge
   - Filter button: Top-right
   - Filter panel: Top-20 to bottom-24
   - Language switcher: Bottom-right
   - All elements properly positioned to avoid overlap

7. **Type Definitions Enhanced**
   - Added `imageUrls?: string[]` field for multiple images support
   - Kept `imageUrl?: string` for backward compatibility
   - District names use correct SRS mappings

8. **Color Palette Applied**
   - All components use SRS-mandated colors:
     - Tan: #D8BA98
     - Maroon: #7F0303
     - Alabaster: #EFE8DF
     - Light Blue: #96C0CE
     - Midnight Blue: #0F414A

### ✅ Backend Status

1. **Existing API Endpoints**
   - GET /api/restaurants - Get all restaurants
   - GET /api/restaurants/{id} - Get single restaurant
   - POST /api/restaurants - Create restaurant
   - PUT /api/restaurants/{id} - Update restaurant
   - DELETE /api/restaurants/{id} - Delete restaurant
   - POST /api/admin/login - Admin authentication
   - GET /api/admin/verify - Verify admin token

2. **Admin Password**
   - Password is set to: `kittypainai` (per SRS)

## ⚠️ Pending Implementation

### 🔴 High Priority - Core SRS Requirements

1. **Multiple Images Support (Backend)**
   - **Current**: Database has single `imageUrl` field
   - **Required**: Support multiple images per restaurant
   - **Changes needed**:
     - Update database schema to add `restaurant_images` table
     - Update backend model to support image collection
     - Create image upload endpoint
     - Update admin dashboard for multiple image uploads
     - CSV import needs to handle multiple images

2. **Map Text Overlay Feature (Admin)**
   - **Required**: Admin can add/edit/delete text on map (e.g., street names)
   - **Required**: Admin can rotate and position map text
   - **Required**: Map text must move and rotate together with the map
   - **Implementation needed**:
     - New database table for map text annotations
     - Backend API for map text CRUD operations
     - Frontend components for text overlay rendering
     - Admin UI for adding/editing map text
     - Text rotation and positioning controls
     - Integration with map transformation logic

3. **CSV Data Import**
   - **Current**: CsvImportService exists but needs verification
   - **Required**: Import data from "Edit Restaurant List – Final restaurant list (1).csv"
   - **Data fields to map**:
     - Zone (Thai district name) → sub_district
     - Restaurant Name → name_th
     - Location (address) → address
     - Link (Google Maps) → google_maps_url
     - Type (cuisine) → cuisine_type
     - หมายเหตุ (Notes) → description_th
     - License info → license_* fields
     - Pin coordinates need to be determined

### 🟡 Medium Priority

1. **Pin Dragging in Admin Mode**
   - **Required**: Admin can drag pins to change positions
   - **Status**: Partially implemented (Pin component has draggable prop)
   - **Needs**: Integration with admin dashboard map view
   - **Implementation needed**:
     - Visual feedback when dragging
     - Real-time coordinate updates
     - Save new coordinates to backend

2. **Image Upload Functionality**
   - **Required**: Admin can upload images
   - **Implementation needed**:
     - File upload endpoint in backend
     - Image storage configuration (local/cloud)
     - Frontend upload component with preview
     - Multiple file selection support

3. **Map Image Masking**
   - **Required**: Crop or mask unfinished areas of map
   - **Required**: Show only clean areas (no stray drawing lines)
   - **Status**: Map image exists but may need masking/cropping

### 🟢 Low Priority - Enhancements

1. **Responsive Design Verification**
   - Ensure mobile-first design works across all screen sizes
   - Test UI elements don't overlap on different devices
   - Verify touch interactions work properly

2. **Performance Optimization**
   - Implement lazy loading for images
   - Optimize map rendering performance
   - Add loading states and error handling

3. **Accessibility Improvements**
   - Add ARIA labels
   - Keyboard navigation support
   - Screen reader compatibility

## 📋 District Name Mappings (SRS Compliant)

| Thai Name          | English Name           | Database Value        |
|--------------------|------------------------|-----------------------|
| มหาพฤฒาราม        | Maha Phruettharam      | MAHA_PHRUETTHARAM     |
| สีลม               | Silom                  | SILOM                 |
| สุริยวงศ์          | Suriyawong             | SURIYAWONG            |
| บางรัก             | Bang Rak               | BANG_RAK              |
| สี่พระยา           | Si Phraya              | SI_PHRAYA             |

## 🎨 Color Palette (SRS Mandatory)

| Color Name      | Hex Code | Usage                          |
|-----------------|----------|--------------------------------|
| Tan             | #D8BA98  | Backgrounds, accents           |
| Maroon          | #7F0303  | Primary buttons, CTAs          |
| Alabaster       | #EFE8DF  | Bottom sheet background, text  |
| Light Blue      | #96C0CE  | Tags, filters                  |
| Midnight Blue   | #0F414A  | Main text, icons               |

## 🗂️ Database Schema Updates Needed

### New Table: restaurant_images
```sql
CREATE TABLE restaurant_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### New Table: map_annotations
```sql
CREATE TABLE map_annotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    position_x DOUBLE NOT NULL,
    position_y DOUBLE NOT NULL,
    rotation DOUBLE DEFAULT 0,
    font_size INT DEFAULT 14,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);
```

## 📝 Admin Requirements Checklist

- [x] Admin route accessible at `/admin`
- [x] Password protection (`kittypainai`)
- [x] Add/Edit/Delete restaurants
- [ ] Upload multiple images per restaurant
- [ ] Drag pins to change positions
- [ ] Add text on map (street names, etc.)
- [ ] Edit map text
- [ ] Rotate map text
- [ ] Position map text
- [ ] Map text moves/rotates with map

## 🚀 Next Steps

1. **Immediate** (Required for basic functionality):
   - Implement backend support for multiple images
   - Create image upload functionality
   - Update admin dashboard to handle multiple images

2. **High Priority** (Core SRS features):
   - Design and implement map text overlay system
   - Create admin UI for map text management
   - Implement pin dragging in admin mode
   - Complete CSV import and verify data mapping

3. **Testing**:
   - Test all features on mobile devices
   - Verify all SRS requirements are met
   - Performance testing with full dataset
   - Cross-browser compatibility testing

## 📄 SRS Compliance Summary

### ✅ Fully Implemented
- Mobile-first responsive design
- Map as main background
- Pan/zoom/rotate functionality
- Pin system with cuisine-specific markers
- Fixed pin size (no clustering)
- Search and filter functionality
- Language switching (Thai/English)
- Bottom sheet with restaurant details
- District tags
- Category tags
- Health-friendly and heritage tags
- Google Maps integration
- Admin authentication

### ⚠️ Partially Implemented
- Multiple image support (frontend ready, backend needs update)
- Pin dragging (frontend has prop, needs admin integration)

### ❌ Not Yet Implemented
- Map text overlay (add/edit/rotate/move with map)
- Multiple image upload in admin
- Image storage and serving
- CSV data import verification

## 💡 Technical Notes

- Frontend uses React 19.2.0 with Vite
- Backend uses Spring Boot 3.2.0 with Java 17
- Database: MySQL with JPA/Hibernate
- Styling: Tailwind CSS with custom SRS color palette
- State management: React Context API
- Routing: React Router v7
- Deployment: Docker Compose

---

**Last Updated**: 2025-01-26
**Status**: Core features implemented, awaiting backend enhancements for multiple images and map text overlay
