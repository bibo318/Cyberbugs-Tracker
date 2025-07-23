# SecResearch - Advanced Security Intelligence Platform

🔍 **Comprehensive vulnerability intelligence platform** aggregating data from CVE databases, exploit repositories, zero-day advisories, and real-time security feeds.

![SecResearch Platform](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 Features

- **Multi-Source Intelligence**: Aggregates data from NVD, Vulners, Exploit-DB, GitHub, ZDI, and security news feeds
- **Real NVD Integration**: Direct integration with NIST's National Vulnerability Database API
- **Advanced Search**: Intelligent search across vulnerabilities, exploits, and security advisories
- **Real-time Updates**: Live security feed integration with RSS parsing
- **Severity Analysis**: CVSS scoring and risk assessment
- **PoC Detection**: Identifies available proof-of-concept exploits
- **Dark Theme**: Cyberpunk-inspired UI optimized for security professionals
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- NVD API key (optional but recommended)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/secresearch-platform.git
   cd secresearch-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   
   Create `.env.local` file in the root directory:
   \`\`\`env
   # NVD API Configuration
   NVD_API_KEY=your_nvd_api_key_here
   
   # Other API Keys (Optional)
   VULNERS_API_KEY=your_vulners_api_key
   GITHUB_TOKEN=your_github_token
   
   # Optional: Redis for caching
   REDIS_URL=redis://localhost:6379
   \`\`\`

4. **Get NVD API Key (Recommended)**
   
   Visit [NVD API Key Request](https://nvd.nist.gov/developers/request-an-api-key) to get your free API key.
   
   **Benefits of API Key:**
   - 50 requests per 30 seconds (vs 5 without key)
   - Better rate limiting
   - More reliable access

5. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Test NVD Integration**
   
   Open [http://localhost:3000/api/nvd/test](http://localhost:3000/api/nvd/test) to verify NVD integration.

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/secresearch-platform)

### Manual Deployment

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables in Vercel**
   
   Add these in your Vercel project settings:
   \`\`\`
   NVD_API_KEY=your_nvd_api_key
   VULNERS_API_KEY=your_vulners_key  
   GITHUB_TOKEN=your_github_token
   \`\`\`

## 🔧 NVD API Integration

### Features

- **CVE Search**: Search by CVE ID (e.g., CVE-2024-4577)
- **Keyword Search**: Search by software, vendor, or vulnerability type
- **Severity Filtering**: Filter by CVSS v3 severity levels
- **Date Range**: Search within specific publication dates
- **Rate Limiting**: Automatic rate limiting compliance
- **Error Handling**: Robust error handling and retry logic

### Usage Examples

\`\`\`typescript
// Search for specific CVE
const nvdClient = new NVDClient(process.env.NVD_API_KEY)
const result = await nvdClient.searchCVE({
  cveId: "CVE-2024-4577"
})

// Keyword search
const phpVulns = await nvdClient.searchCVE({
  keywordSearch: "PHP",
  cvssV3Severity: "HIGH",
  resultsPerPage: 20
})

// Date range search
const recentVulns = await nvdClient.searchCVE({
  keywordSearch: "Apache",
  pubStartDate: "2024-01-01T00:00:000 UTC-00:00",
  pubEndDate: "2024-12-31T23:59:999 UTC-00:00"
})
\`\`\`

### Rate Limits

| API Key Status | Rate Limit | Recommended Use |
|----------------|------------|-----------------|
| **Without Key** | 5 requests/30 seconds | Testing, light usage |
| **With Key** | 50 requests/30 seconds | Production, heavy usage |

## 🔍 Search Examples

Try these search queries to test the platform:

- **CVE-2024-4577** - Specific CVE lookup
- **PHP** - All PHP-related vulnerabilities
- **Apache 2.4** - Apache web server vulnerabilities
- **Microsoft Exchange** - Exchange server security issues
- **CVSS >= 9.0** - Critical severity vulnerabilities
- **0day** - Zero-day vulnerabilities and news

## 🛠 API Endpoints

### Search API
\`\`\`
GET /api/search?q={query}&filter={type}&sort={order}
\`\`\`

**Parameters:**
- `q`: Search query (CVE ID, keyword, software name)
- `filter`: `all`, `cve`, `poc`, `news`, `high-severity`
- `sort`: `date`, `severity`, `relevance`

**Response:**
\`\`\`json
{
  "results": [...],
  "total": 42,
  "query": "PHP",
  "meta": {
    "duration": "1,234ms",
    "sources": {
      "nvd": 15,
      "github": 8,
      "news": 3
    }
  }
}
\`\`\`

### NVD Test API
\`\`\`
GET /api/nvd/test
\`\`\`

Tests NVD integration and displays API status, rate limits, and sample queries.

## 🔧 Configuration

### NVD API Settings

The NVD client automatically handles:
- Rate limiting (6s delay without key, 0.6s with key)
- Error handling and retries
- Request logging and monitoring
- Data transformation to unified format

### Customization

Edit `lib/nvd-client.ts` to customize:
- Search parameters
- Rate limiting behavior
- Data transformation logic
- Error handling strategies

## 🐛 Troubleshooting

### Common Issues

**1. NVD API Rate Limiting**
\`\`\`
Error: NVD API Error: 403 Forbidden
\`\`\`
**Solution:** Get an API key or reduce request frequency.

**2. Network Timeouts**
\`\`\`
Error: fetch failed
\`\`\`
**Solution:** Check internet connection and NVD service status.

**3. Invalid CVE Format**
\`\`\`
No results found
\`\`\`
**Solution:** Ensure CVE format is correct (e.g., CVE-2024-1234).

### Debug Mode

Enable debug logging by setting:
\`\`\`env
NODE_ENV=development
\`\`\`

This will show:
- API request/response details
- Rate limiting information
- Search performance metrics
- Integration test results

## 📊 Monitoring

The platform includes built-in monitoring:

- **API Status Monitor**: Real-time API health checks
- **Sources Monitor**: Track data source availability
- **Performance Metrics**: Response times and success rates
- **Debug Panel**: Detailed request/response logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/nvd-enhancement`)
3. Commit changes (`git commit -m 'Add NVD advanced filtering'`)
4. Push to branch (`git push origin feature/nvd-enhancement`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NIST NVD](https://nvd.nist.gov) for the comprehensive CVE database
- [Vulners](https://vulners.com) for vulnerability intelligence
- [Exploit-DB](https://exploit-db.com) for exploit repository
- [shadcn/ui](https://ui.shadcn.com) for UI components

## 📞 Support

- 📧 Email: support@secresearch.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/secresearch-platform/issues)
- 📖 NVD API Docs: [https://nvd.nist.gov/developers](https://nvd.nist.gov/developers)

---

**⚠️ Disclaimer**: This tool is for educational and authorized security research purposes only. Users are responsible for complying with applicable laws and regulations.

**🔒 Privacy**: No search queries or personal data are stored. All API calls are made server-side to protect user privacy.
