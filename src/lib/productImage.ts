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



/** Resolve product/gallery image paths from API uploads, Cloudinary, or static assets */

export function productImageUrl(path?: string | null) {

  if (!path) return '';

  if (path.startsWith('https://res.cloudinary.com/')) return path;

  // Legacy Render /uploads URLs — images are served from the Netlify site
  if (path.includes('.onrender.com/uploads/')) {
    const legacyPath = extractUploadsPath(path);
    if (legacyPath) {
      const site =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://harvdreams.com';
      return `${site.replace(/\/$/, '')}${legacyPath}`;
    }
  }

  const uploadsPath = extractUploadsPath(path);



  // Dev: same-origin /uploads via Vite proxy (avoids cross-origin broken images)

  if (import.meta.env.DEV && uploadsPath) {

    return uploadsPath;

  }



  if (uploadsPath && API_BASE) {

    return joinBase(API_BASE, uploadsPath);

  }



  if (path.startsWith('http://') || path.startsWith('https://')) {

    return path;

  }



  const normalized = path.startsWith('/') ? path : `/${path}`;

  return normalized;

}


