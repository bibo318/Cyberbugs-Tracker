# SecResearch - Nền Tảng Thông Tin Bảo Mật Trực Tiếp

🔍 **Nền tảng thông tin lỗ hổng bảo mật toàn diện** tổng hợp dữ liệu từ cơ sở dữ liệu CVE, kho lưu trữ exploit, cảnh báo zero-day và nguồn cấp dữ liệu bảo mật thời gian thực.

![SecResearch Platform](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 Tính Năng Chính

### 🌐 **Đa Ngôn Ngữ**
- **Tiếng Việt** và **English** với giao diện hoàn chỉnh
- Chuyển đổi ngôn ngữ dễ dàng với selector có cờ quốc gia
- Lưu trữ lựa chọn ngôn ngữ tự động

### 📡 **Dữ Liệu Thời Gian Thực**
- **Tích hợp NVD**: Kết nối trực tiếp với API National Vulnerability Database của NIST
- **Vulners API**: Nền tảng thông tin lỗ hổng toàn diện
- **GitHub Search**: Tìm kiếm PoC exploits và công cụ bảo mật
- **Nguồn tin bảo mật**: Tích hợp RSS feeds từ các trang tin tức bảo mật hàng đầu

### 🔍 **Tìm Kiếm Thông Minh**
- Tìm kiếm thông minh qua nhiều nguồn lỗ hổng, exploits và cảnh báo bảo mật
- Bộ lọc nâng cao theo loại, mức độ nghiêm trọng, thời gian
- Sắp xếp theo ngày, mức độ nghiêm trọng, độ liên quan
- Lịch sử tìm kiếm và gợi ý nhanh

### 🎨 **Giao Diện Hiện Đại**
- **Dark Theme**: Giao diện cyberpunk tối ưu cho chuyên gia bảo mật
- **Responsive Design**: Hoạt động mượt mà trên desktop và mobile
- **Real-time Indicators**: Hiển thị trạng thái dữ liệu trực tiếp
- **Source Tags**: Nhận diện nguồn dữ liệu bằng màu sắc

### 🛠 **Công Cụ Debug**
- **Debug Mode**: Bật/tắt bằng `Ctrl+Shift+D` hoặc `?debug=true`
- **API Monitor**: Theo dõi trạng thái các nguồn dữ liệu
- **Performance Metrics**: Thời gian phản hồi và thống kê
- **Real-time Logs**: Nhật ký hoạt động chi tiết

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js 18+ 
- npm hoặc yarn
- API keys (tùy chọn nhưng khuyến nghị)

### Cài Đặt Nhanh

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/secresearch-platform.git
   cd secresearch-platform
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường**
   
   Tạo file `.env.local` trong thư mục gốc:
   ```env
   # Cấu hình NVD API (Khuyến nghị)
   NVD_API_KEY=your_nvd_api_key_here
   
   # Các API Keys khác (Tùy chọn)
   VULNERS_API_KEY=your_vulners_api_key
   GITHUB_TOKEN=your_github_token
   ```

4. **Chạy development server**
   ```bash
   npm run dev
   ```

5. **Truy cập ứng dụng**
   
   Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

## 🔑 Hướng Dẫn Lấy API Keys

### 1. **NVD API Key (Khuyến nghị cao)**
- Truy cập: [NVD API Key Request](https://nvd.nist.gov/developers/request-an-api-key)
- **Lợi ích**: 50 requests/30s (thay vì 5 requests/30s)
- **Miễn phí** và cải thiện đáng kể hiệu suất

### 2. **Vulners API Key**
- Truy cập: [Vulners User Info](https://vulners.com/userinfo)
- Đăng ký tài khoản miễn phí
- Lấy API key từ dashboard

### 3. **GitHub Token**
- Truy cập: [GitHub Settings > Tokens](https://github.com/settings/tokens)
- Tạo Personal Access Token
- Quyền cần thiết: `public_repo` (đọc repository công khai)

## 🌐 Triển Khai Production

### Triển Khai Vercel (Khuyến nghị)

1. **Push code lên GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Kết nối với Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Cấu hình environment variables
   - Deploy!

3. **Environment Variables trên Vercel**
   ```
   NVD_API_KEY=your_nvd_api_key
   VULNERS_API_KEY=your_vulners_key  
   GITHUB_TOKEN=your_github_token
   ```

### Triển Khai Netlify

1. **Build project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Kéo thả thư mục `out` vào Netlify
   - Hoặc kết nối GitHub repository

## 📖 Hướng Dẫn Sử Dụng

### Tìm Kiếm Cơ Bản
- Nhập CVE ID: `CVE-2024-4577`
- Tìm theo từ khóa: `PHP`, `Apache`, `Microsoft Exchange`
- Tìm theo mức độ: Sử dụng bộ lọc "High Severity"

### Tìm Kiếm Nâng Cao
- **Bộ lọc**: Chọn loại dữ liệu (CVE, PoC, News)
- **Sắp xếp**: Theo ngày, mức độ nghiêm trọng, độ liên quan
- **Lịch sử**: Click vào các tìm kiếm gần đây

### Debug Mode
- **Bật**: `Ctrl+Shift+D` hoặc thêm `?debug=true` vào URL
- **Tính năng**: API monitor, performance metrics, logs
- **Tắt**: `Ctrl+Shift+D` lại hoặc reload trang

## 🔧 API Endpoints

### Search API
```
GET /api/search?q={query}&filter={type}&sort={order}
```

**Parameters:**
- `q`: Truy vấn tìm kiếm (CVE ID, từ khóa, tên phần mềm)
- `filter`: `all`, `cve`, `poc`, `news`, `high-severity`
- `sort`: `date`, `severity`, `relevance`

**Response:**
```json
{
  "results": [...],
  "total": 42,
  "query": "PHP",
  "meta": {
    "duration": "1,234ms",
    "sources": {
      "NVD": 15,
      "GitHub": 8,
      "DemoNews": 3
    },
    "realtime": true
  }
}
```

### NVD Test API
```
GET /api/nvd/test
```
Kiểm tra tích hợp NVD và hiển thị trạng thái API, rate limits, và truy vấn mẫu.

### Sources Status API
```
GET /api/sources/status
```
Kiểm tra trạng thái tất cả nguồn dữ liệu thời gian thực.

## 🎨 Tùy Chỉnh Giao Diện

### Màu Sắc Source Tags
- **NVD**: Xanh dương (`bg-blue-500/20`)
- **Vulners**: Tím (`bg-purple-500/20`)
- **GitHub**: Xám (`bg-gray-500/20`)
- **Exploit-DB**: Đỏ (`bg-red-500/20`)
- **DemoNews**: Xanh lá (`bg-green-500/20`)

### Màu Sắc Mức Độ Nghiêm Trọng
- **Critical**: Đỏ (`bg-red-500/20`)
- **High**: Cam (`bg-orange-500/20`)
- **Medium**: Vàng (`bg-yellow-500/20`)
- **Low**: Xanh lá (`bg-green-500/20`)

## 🐛 Xử Lý Sự Cố

### Lỗi Thường Gặp

**1. Rate Limiting NVD API**
```
Error: NVD API Error: 403 Forbidden
```
**Giải pháp**: Lấy API key hoặc giảm tần suất request.

**2. Network Timeouts**
```
Error: fetch failed
```
**Giải pháp**: Kiểm tra kết nối internet và trạng thái dịch vụ NVD.

**3. Định dạng CVE không hợp lệ**
```
No results found
```
**Giải pháp**: Đảm bảo định dạng CVE đúng (ví dụ: CVE-2024-1234).

### Debug Mode

Bật debug mode để xem:
- Chi tiết request/response API
- Thông tin rate limiting
- Metrics hiệu suất tìm kiếm
- Kết quả kiểm tra tích hợp

## 📊 Giám Sát Hệ Thống

Nền tảng bao gồm giám sát tích hợp:

- **API Status Monitor**: Kiểm tra sức khỏe API thời gian thực
- **Sources Monitor**: Theo dõi tính khả dụng của nguồn dữ liệu
- **Performance Metrics**: Thời gian phản hồi và tỷ lệ thành công
- **Debug Panel**: Logging chi tiết request/response

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/nvd-enhancement`)
3. Commit thay đổi (`git commit -m 'Add NVD advanced filtering'`)
4. Push lên branch (`git push origin feature/nvd-enhancement`)
5. Mở Pull Request

## 📝 Giấy Phép

Dự án này được cấp phép theo MIT License - xem file [LICENSE](LICENSE) để biết chi tiết.

## 🙏 Lời Cảm Ơn

- [NIST NVD](https://nvd.nist.gov) cho cơ sở dữ liệu CVE toàn diện
- [Vulners](https://vulners.com) cho thông tin lỗ hổng bảo mật
- [Exploit-DB](https://exploit-db.com) cho kho lưu trữ exploit
- [shadcn/ui](https://ui.shadcn.com) cho các component UI
- [Lucide React](https://lucide.dev) cho bộ icon đẹp

## 📞 Hỗ Trợ

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/secresearch-platform/issues)
- 📖 NVD API Docs: [https://nvd.nist.gov/developers](https://nvd.nist.gov/developers)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/secresearch-platform/discussions)

## 🔄 Changelog

### v1.2.0 (Latest)
- ✅ Thêm hỗ trợ đa ngôn ngữ (Tiếng Việt + English)
- ✅ Source tags với màu sắc phân biệt
- ✅ Debug mode có thể bật/tắt
- ✅ Cải thiện real-time indicators
- ✅ Tối ưu hóa hiệu suất API

### v1.1.0
- ✅ Tích hợp NVD API thời gian thực
- ✅ Thêm Vulners và GitHub integration
- ✅ API monitoring và status checks
- ✅ Responsive design improvements

### v1.0.0
- ✅ Phiên bản đầu tiên
- ✅ Tìm kiếm cơ bản
- ✅ Dark theme cyberpunk
- ✅ Mock data sources

---

**⚠️ Tuyên Bố Miễn Trừ Trách Nhiệm**: Công cụ này chỉ dành cho mục đích giáo dục và nghiên cứu bảo mật được ủy quyền. Người dùng có trách nhiệm tuân thủ các luật và quy định hiện hành.

**🔒 Quyền Riêng Tư**: Không có truy vấn tìm kiếm hoặc dữ liệu cá nhân nào được lưu trữ. Tất cả các cuộc gọi API được thực hiện phía server để bảo vệ quyền riêng tư của người dùng.

**🌟 Star Repository**: Nếu bạn thấy dự án hữu ích, hãy star repository để ủng hộ nhà phát triển!