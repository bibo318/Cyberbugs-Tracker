# SecResearch - Advanced Security Intelligence Platform

🔍 **Comprehensive vulnerability intelligence platform** aggregating data from CVE databases, exploit repositories, zero-day advisories, and real-time security feeds.

![SecResearch Platform](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 Features

- **Multi-Source Intelligence**: Aggregates data from CVE, NVD, Exploit-DB, GitHub, ZDI, and security news feeds
- **Advanced Search**: Intelligent search across vulnerabilities, exploits, and security advisories
- **Real-time Updates**: Live security feed integration with RSS parsing
- **Severity Analysis**: CVSS scoring and risk assessment
- **PoC Detection**: Identifies available proof-of-concept exploits
- **Dark Theme**: Cyberpunk-inspired UI optimized for security professionals
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Export Capabilities**: JSON/CSV export for further analysis

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for external services (optional for demo)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/bibo318/Cyberbugs-Tracker
   cd Cyberbugs-Tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Configuration**
   
   Create `.env.local` file in the root directory:
   \`\`\`env
   # API Keys (Optional - demo works without them)
   VULNERS_API_KEY=your_vulners_api_key
   NVD_API_KEY=your_nvd_api_key
   GITHUB_TOKEN=your_github_token
   
   # Optional: Redis for caching
   REDIS_URL=redis://localhost:6379
   \`\`\`

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Cyberbugs-Tracker)

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
   VULNERS_API_KEY=your_key_here
   NVD_API_KEY=your_key_here  
   GITHUB_TOKEN=your_token_here
   \`\`\`

## 🔧 API Integration

### Supported Data Sources

| Source | Type | API Documentation |
|--------|------|-------------------|
| **Vulners** | CVE, PoC, Exploits | [vulners.com/docs](https://vulners.com/docs) |
| **NVD** | Official CVE Database | [nvd.nist.gov/developers](https://nvd.nist.gov/developers) |
| **Exploit-DB** | Exploit Repository | [exploit-db.com](https://www.exploit-db.com) |
| **GitHub** | PoC Repositories | [docs.github.com/rest](https://docs.github.com/en/rest) |
| **ZDI** | Zero-Day Advisories | [zerodayinitiative.com](https://www.zerodayinitiative.com) |
| **Security News** | RSS Feeds | Multiple sources |

### API Keys Setup

1. **Vulners API**
   - Register at [vulners.com](https://vulners.com)
   - Generate API key in dashboard
   - Add to `.env.local` as `VULNERS_API_KEY`

2. **NVD API** 
   - Request API key at [nvd.nist.gov](https://nvd.nist.gov/developers/request-an-api-key)
   - Add to `.env.local` as `NVD_API_KEY`

3. **GitHub Token**
   - Generate personal access token in GitHub settings
   - Add to `.env.local` as `GITHUB_TOKEN`

## 🎨 Customization

### Theme Configuration

The platform uses a cyberpunk-inspired dark theme. Customize colors in `tailwind.config.ts`:

\`\`\`typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette
        'cyber-purple': '#8B5CF6',
        'cyber-red': '#EF4444', 
        'cyber-green': '#10B981',
        'cyber-blue': '#3B82F6'
      }
    }
  }
}
\`\`\`

### Adding New Data Sources

1. Create API client in `lib/api-clients.ts`
2. Add search logic in `app/api/search/route.ts`
3. Update result types in `lib/types.ts`

## 📊 Usage Examples

### Search Queries

- **CVE Lookup**: `CVE-2024-4577`
- **Software Vulnerabilities**: `Apache 2.4.49`
- **Product Security**: `Microsoft Exchange 2019`
- **Exploit Search**: `PHP RCE exploit`
- **Zero-day Research**: `0day Windows kernel`

### API Endpoints

- `GET /api/search?q=query&filter=type&sort=date`
- `GET /api/cve/{cve-id}` (planned)
- `GET /api/stats` (planned)

## 🛡️ Security Considerations

- **Rate Limiting**: Implement API rate limiting for production
- **Input Validation**: All search inputs are sanitized
- **CORS Policy**: Configure appropriate CORS headers
- **API Key Security**: Never expose API keys in client-side code

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vulners](https://vulners.com) for vulnerability intelligence
- [NVD](https://nvd.nist.gov) for CVE database
- [Exploit-DB](https://exploit-db.com) for exploit repository
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Lucide](https://lucide.dev) for icons

## 📞 Support

- 📧 Email: support@secresearch.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/Cyberbugs-Tracker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/Cyberbugs-Tracker/discussions)

---

**⚠️ Disclaimer**: This tool is for educational and authorized security research purposes only. Users are responsible for complying with applicable laws and regulations.
