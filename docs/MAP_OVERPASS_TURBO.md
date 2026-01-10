# Map Overpass Turbo - Tài liệu hướng dẫn

## Tổng quan

Tính năng Map Overpass Turbo tích hợp với Overpass Turbo API để truy vấn và hiển thị dữ liệu ranh giới hành chính từ OpenStreetMap trên bản đồ interactive sử dụng MapLibre GL.

## Cấu trúc

### 1. Service Layer

**File**: `src/app/services/overpass.service.ts`

Service này chịu trách nhiệm:
- Gọi Overpass Turbo API để lấy dữ liệu OpenStreetMap
- Chuyển đổi dữ liệu từ Overpass format sang GeoJSON
- Sanitize input để tránh query injection attacks
- Xử lý errors và logging

#### Các phương thức chính:

```typescript
// Thực hiện truy vấn Overpass tùy chỉnh
executeQuery(query: string): Observable<GeoJSONFeatureCollection>

// Lấy ranh giới hành chính của Lâm Đồng
getLamDongBoundaries(): Observable<GeoJSONFeatureCollection>

// Lấy ranh giới hành chính theo tên khu vực và cấp
getAdministrativeBoundaries(areaName: string, adminLevel: string): Observable<GeoJSONFeatureCollection>
```

### 2. Component Layer

**File**: `src/app/pages/uikit/mapoverpassturbo.ts`

Component này hiển thị:
- Bản đồ interactive với MapLibre GL
- Form controls để cấu hình truy vấn
- Thông tin về Overpass API
- Statistics và error messages

#### Các tính năng:

1. **Map Controls**:
   - Navigation (zoom in/out, rotate)
   - Fullscreen
   - Scale indicator
   - Attribution

2. **Query Parameters**:
   - Tỉnh/Thành phố (text input)
   - Cấp hành chính (dropdown: 4, 6, 8)
   - Style hiển thị (dropdown: Mặc định, Đậm màu, Pastel, Neon)

3. **Interactive Features**:
   - Click vào ranh giới để xem popup
   - Hover effect trên boundaries
   - Auto-fit bounds khi load data

4. **Theme Support**:
   - Light/Dark mode tự động
   - Map tiles thay đổi theo theme

## Cách sử dụng

### Truy cập trang

Điều hướng đến: `/uikit/map-overpass-turbo`

### Truy vấn dữ liệu

1. Nhập tên tỉnh/thành phố (VD: "Lâm Đồng", "Hà Nội", "TP Hồ Chí Minh")
2. Chọn cấp hành chính:
   - Cấp 4: Tỉnh/Thành phố
   - Cấp 6: Quận/Huyện
   - Cấp 8: Phường/Xã
3. Chọn style hiển thị (optional)
4. Click "Tải dữ liệu"

### Tương tác với bản đồ

- **Zoom**: Sử dụng scroll hoặc nút +/- controls
- **Pan**: Click và kéo bản đồ
- **Rotate**: Right-click và kéo (hoặc Ctrl + drag)
- **Fullscreen**: Click nút fullscreen
- **View boundary info**: Click vào ranh giới

## Query Overpass

### Cấu trúc truy vấn mẫu

```overpassql
[out:json][timeout:25];
area["name"~"Lâm Đồng"]["admin_level"="4"]->.lamdong;
relation(area.lamdong)["admin_level"="6"]["boundary"="administrative"];
out body;
>;
out skel qt;
```

### Giải thích:

1. `[out:json][timeout:25]`: Output format JSON, timeout 25 giây
2. `area["name"~"Lâm Đồng"]["admin_level"="4"]`: Tìm area (tỉnh) có tên chứa "Lâm Đồng", cấp 4
3. `relation(area.lamdong)["admin_level"="6"]["boundary"="administrative"]`: Lấy các relation (quận/huyện) cấp 6 trong area
4. `out body`: Output toàn bộ thông tin
5. `>`: Lấy các members của relation
6. `out skel qt`: Output skeleton data (coordinates)

## Rendering Styles

### 1. Mặc định (Default)
- Fill color: #3b82f6 (blue)
- Fill opacity: 0.2
- Stroke color: #2563eb
- Stroke width: 2px

### 2. Đậm màu (Bold)
- Fill color: #3b82f6
- Fill opacity: 0.4
- Stroke color: #1e40af
- Stroke width: 3px

### 3. Pastel
- Fill color: #a5b4fc (light indigo)
- Fill opacity: 0.3
- Stroke color: #6366f1
- Stroke width: 2px

### 4. Neon
- Fill color: #22d3ee (cyan)
- Fill opacity: 0.3
- Stroke color: #06b6d4
- Stroke width: 2.5px

## Bảo mật

### Input Sanitization

Service sử dụng method `sanitizeQueryInput()` để:
- Loại bỏ các ký tự đặc biệt có thể gây query injection
- Chỉ cho phép: chữ cái, số, khoảng trắng, dấu gạch ngang, và ký tự tiếng Việt
- Regex pattern: `/[^\w\s\-ÀÁÂ...]/g`

### External Links

- Sử dụng `rel="noopener noreferrer"` cho Wikipedia links
- URL encoding với `encodeURIComponent()`
- Validate format trước khi render

## Xử lý lỗi

### Các trường hợp lỗi:

1. **Network Error**: Không kết nối được đến Overpass API
   - Hiển thị: "Lỗi khi tải dữ liệu: Không thể lấy dữ liệu từ Overpass API"

2. **Empty Result**: Không tìm thấy dữ liệu
   - Hiển thị: "Không tìm thấy dữ liệu cho khu vực này. Vui lòng thử lại với tên khác."

3. **Timeout**: Query quá lâu (> 25 giây)
   - Overpass API sẽ trả về timeout error

## Tối ưu hóa

### Performance

1. **Lazy Loading**: Component được lazy load qua route
2. **Map Caching**: Map style được cache bởi MapLibre
3. **GeoJSON Optimization**: Chỉ render các features cần thiết

### Network

1. **API Timeout**: Giới hạn 25 giây cho mỗi query
2. **Error Handling**: Proper error messages cho user
3. **Loading States**: Spinner overlay trong khi fetch data

## Dependencies

- **MapLibre GL**: ^5.15.0 - Map rendering library
- **Angular HTTP Client**: Gọi Overpass API
- **PrimeNG**: UI components (Button, Select, Message, etc.)
- **RxJS**: Reactive programming cho API calls

## API Endpoints

### Overpass API
- **URL**: `https://overpass-api.de/api/interpreter`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Response**: JSON (Overpass format)

### Map Tiles
- **Light**: `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`
- **Dark**: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`

## Troubleshooting

### Map không hiển thị
- Check console cho MapLibre errors
- Verify container element exists
- Check network access to basemaps.cartocdn.com

### Không load được dữ liệu
- Check network access to overpass-api.de
- Verify query syntax
- Check CORS policy

### Performance issues
- Giảm số lượng features bằng cách filter theo admin_level cao hơn
- Increase timeout nếu cần
- Use simpler geometries

## Future Enhancements

Các tính năng có thể thêm vào:

1. **Export Data**: Xuất GeoJSON về file
2. **Multiple Layers**: Hiển thị nhiều layer cùng lúc
3. **Custom Queries**: Editor để viết custom Overpass queries
4. **Search**: Tìm kiếm boundaries theo tên
5. **Comparison**: So sánh ranh giới của nhiều khu vực
6. **Analytics**: Thống kê về diện tích, dân số, etc.

## License

Dữ liệu từ OpenStreetMap tuân theo [ODbL license](https://opendatacommons.org/licenses/odbl/).

## References

- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Overpass Turbo](https://overpass-turbo.eu/)
- [MapLibre GL Documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
