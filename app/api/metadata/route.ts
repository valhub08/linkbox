import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Validate and sanitize URL to prevent SSRF attacks
function validateUrl(urlString: string): { valid: boolean; error?: string; parsedUrl?: URL } {
  try {
    const parsedUrl = new URL(urlString);

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    // Block private IP ranges and localhost
    const hostname = parsedUrl.hostname.toLowerCase();

    // Block localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return { valid: false, error: 'Access to localhost is not allowed' };
    }

    // Block private IP ranges (IPv4)
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Pattern);

    if (ipMatch) {
      const [, a, b, c, d] = ipMatch.map(Number);

      // Check private IP ranges
      if (
        a === 10 || // 10.0.0.0/8
        (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
        (a === 192 && b === 168) || // 192.168.0.0/16
        a === 127 || // 127.0.0.0/8 (loopback)
        a === 169 && b === 254 || // 169.254.0.0/16 (link-local)
        a === 0 || // 0.0.0.0/8
        a >= 224 // 224.0.0.0/4 (multicast)
      ) {
        return { valid: false, error: 'Access to private IP ranges is not allowed' };
      }
    }

    // Block internal domain patterns
    const blockedPatterns = [
      /^metadata\./i,
      /^169\.254\./,
      /\.local$/i,
      /\.internal$/i,
      /\.intranet$/i,
    ];

    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      return { valid: false, error: 'Access to internal domains is not allowed' };
    }

    return { valid: true, parsedUrl };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL to prevent SSRF
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
      maxRedirects: 5, // Limit redirects
      maxContentLength: 5 * 1024 * 1024, // Max 5MB
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract metadata
    const metadata = {
      title: '',
      description: '',
      thumbnail: '',
      favicon: '',
    };

    // Get title (Open Graph > Twitter > title tag > h1)
    metadata.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      '';

    // Get description (Open Graph > Twitter > meta description)
    metadata.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // Get thumbnail (Open Graph > Twitter)
    let thumbnailUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      '';

    // Make thumbnail URL absolute if relative
    if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      thumbnailUrl = new URL(thumbnailUrl, baseUrl.origin).toString();
    }
    metadata.thumbnail = thumbnailUrl;

    // Get favicon
    let faviconUrl =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico';

    // Make favicon URL absolute if relative
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      faviconUrl = new URL(faviconUrl, baseUrl.origin).toString();
    }
    metadata.favicon = faviconUrl;

    // Clean up title and description
    metadata.title = metadata.title.trim().substring(0, 200);
    metadata.description = metadata.description.trim().substring(0, 500);

    return NextResponse.json({ success: true, data: metadata }, { status: 200 });
  } catch (error: any) {
    console.error('Metadata extraction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to extract metadata',
      },
      { status: 500 }
    );
  }
}
