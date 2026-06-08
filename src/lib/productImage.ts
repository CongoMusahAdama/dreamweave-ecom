import { API_BASE } from '@/lib/api';

function joinBase(base: string, assetPath: string) {
  const cleanBase = base.replace(/\/$/, '');
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${cleanBase}${cleanPath}`;
}

function extractUploadsPath(path: string) {
  const match = path.match(/\/uploads\/[^?#]+/);
  return match ? match[0] : null;
}

function siteOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }
  return import.meta.env.PROD ? 'https://harvdreams.com' : API_BASE.replace(/\/$/, '');
}

/** Resolve product/gallery image paths from API uploads, Cloudinary, or static assets */
export function productImageUrl(path?: string | null) {
  if (!path) return '';

  if (path.startsWith('https://res.cloudinary.com/')) return path;

  // Legacy Render /uploads URLs — files are served from the Netlify site
  if (path.includes('.onrender.com/uploads/')) {
    const legacyPath = extractUploadsPath(path);
    if (legacyPath) {
      return `${siteOrigin()}${legacyPath}`;
    }
  }

  // Full URLs from API (harvdreams.com, Cloudinary, etc.) — do not rewrite to API host
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const uploadsPath = extractUploadsPath(path);

  // Dev: same-origin /uploads via Vite proxy
  if (import.meta.env.DEV && uploadsPath) {
    return uploadsPath;
  }

  // Relative /uploads paths — serve from site (Netlify public/uploads), not Render API
  if (uploadsPath) {
    return joinBase(siteOrigin(), uploadsPath);
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized;
}
