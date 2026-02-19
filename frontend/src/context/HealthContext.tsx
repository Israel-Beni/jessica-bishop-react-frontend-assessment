import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ServerStatus } from '../components/ServerOfflineCard';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:300/api';

interface HealthContextType {
  isOnline: boolean | null;
  serverStatus: ServerStatus;
}

const HealthContext = createContext<HealthContextType>({
  isOnline: null,
  serverStatus: 'waking',
});

/**
 * Perform a single health check and return the new server status:
 *   • 'online'     — 200 OK from /api/health
 *   • 'restarting' — server responded but with 5xx (deploy/restart in progress)
 *   • 'waking'     — no response at all (Render cold-start / network timeout)
 *   • 'offline'    — explicit network failure (connection refused, DNS fail)
 */
async function checkServerStatus(): Promise<ServerStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 s per attempt
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) return 'online';
    if (res.status >= 500) return 'restarting';
    return 'offline';
  } catch (err: any) {
    if (err?.name === 'AbortError') return 'waking';
    return 'offline';
  }
}

export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>('waking');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isOnline = serverStatus === 'online';

  const poll = async () => {
    const status = await checkServerStatus();
    setServerStatus(status);
    return status;
  };

  useEffect(() => {
    // Immediate check on mount
    poll();

    // When waking, retry aggressively every 5 s (up to Render's ~60 s cold-start)
    // Otherwise poll every 15 s to stay up-to-date without hammering the server
    const startPolling = (fast: boolean) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(async () => {
        const status = await poll();
        // Once online or a stable error, slow down polling
        if ((fast && status === 'online') || status === 'offline') {
          startPolling(false);
        }
      }, fast ? 5000 : 15000);
    };

    startPolling(true);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HealthContext.Provider value={{ isOnline, serverStatus }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
