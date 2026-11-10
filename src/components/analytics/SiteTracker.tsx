import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/lib/api';

const VISITOR_KEY = 'hd_vid';
const SESSION_KEY = 'hd_session';
const SESSION_IDLE_MS = 30 * 60 * 1000;

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function readStore(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode — ids just won't persist */
  }
}

/** Anonymous visitor id (per browser) and a session id that renews after 30 idle minutes. */
function resolveIds() {
  let firstVisit = false;
  let visitorId = readStore(VISITOR_KEY);
  if (!visitorId) {
    visitorId = randomId();
    firstVisit = true;
    writeStore(VISITOR_KEY, visitorId);
  }

  const now = Date.now();
  let sessionId = '';
  let newSession = true;
  try {
    const saved = JSON.parse(readStore(SESSION_KEY) || 'null') as { id: string; last: number } | null;
    if (saved && now - saved.last < SESSION_IDLE_MS) {
      sessionId = saved.id;
      newSession = false;
    }
  } catch {
    /* ignore corrupt value */
  }
  if (!sessionId) sessionId = randomId();
  writeStore(SESSION_KEY, JSON.stringify({ id: sessionId, last: now }));

  return { visitorId, sessionId, firstVisit, newSession };
}

/** Sends one anonymous page view per route change. Admin pages and admin users are skipped. */
const SiteTracker = () => {
  const { pathname } = useLocation();
  const { isAdmin, loading } = useAuth();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (loading || isAdmin || pathname.startsWith('/admin')) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const { visitorId, sessionId, firstVisit, newSession } = resolveIds();
    let referrer = '';
    if (newSession && document.referrer) {
      try {
        if (new URL(document.referrer).host !== window.location.host) referrer = document.referrer;
      } catch {
        /* ignore */
      }
    }

    fetch(`${API_BASE}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, sessionId, path: pathname, referrer, firstVisit }),
      keepalive: true,
    }).catch(() => {
      /* analytics must never break the shop */
    });
  }, [pathname, isAdmin, loading]);

  return null;
};

export default SiteTracker;
