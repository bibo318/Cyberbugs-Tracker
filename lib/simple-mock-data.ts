// File đơn giản chỉ chứa mock data, không import gì cả
export const mockSecurityData = [
  {
    id: "CVE-2024-4577",
    type: "cve" as const,
    title: "PHP CGI Argument Injection Vulnerability",
    description: "A critical vulnerability in PHP CGI that allows remote code execution through argument injection.",
    severity: "Critical",
    cvss: 9.8,
    published: "2024-06-07",
    source: "NVD",
    url: "https://nvd.nist.gov/vuln/detail/CVE-2024-4577",
    tags: ["PHP", "RCE", "Critical", "CVE"],
  },
  {
    id: "CVE-2023-44487",
    type: "cve" as const,
    title: "HTTP/2 Rapid Reset Attack",
    description: "HTTP/2 protocol vulnerability allowing denial of service attacks.",
    severity: "High",
    cvss: 7.5,
    published: "2023-10-10",
    source: "NVD",
    url: "https://nvd.nist.gov/vuln/detail/CVE-2023-44487",
    tags: ["HTTP/2", "DoS", "High", "CVE"],
  },
  {
    id: "php-exploit-1",
    type: "poc" as const,
    title: "PHP CGI Exploit PoC",
    description: "Proof of concept exploit for CVE-2024-4577 PHP vulnerability",
    severity: "High",
    published: "2024-06-08",
    source: "GitHub",
    url: "https://github.com/example/php-exploit",
    tags: ["PoC", "Exploit", "PHP"],
  },
  {
    id: "apache-exploit-1",
    type: "poc" as const,
    title: "Apache HTTP Server Exploit",
    description: "Exploit targeting Apache HTTP Server vulnerabilities",
    severity: "Medium",
    published: "2024-05-15",
    source: "GitHub",
    url: "https://github.com/example/apache-exploit",
    tags: ["PoC", "Apache", "Exploit"],
  },
  {
    id: "news-php-vuln",
    type: "news" as const,
    title: "Critical PHP Vulnerability Discovered",
    description: "Security researchers have found a critical vulnerability in PHP that affects millions of websites.",
    published: "2024-06-07",
    source: "BleepingComputer",
    url: "https://bleepingcomputer.com/news/security/php-vulnerability",
    tags: ["PHP", "Security", "News"],
  },
  {
    id: "news-apache-update",
    type: "news" as const,
    title: "Apache Releases Security Update",
    description: "Apache Foundation releases critical security updates for HTTP Server.",
    published: "2024-05-20",
    source: "The Hacker News",
    url: "https://thehackernews.com/apache-update",
    tags: ["Apache", "Update", "Security"],
  },
]
