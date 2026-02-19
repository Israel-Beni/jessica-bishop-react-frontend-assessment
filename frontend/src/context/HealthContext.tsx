import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ServerStatus } from '../components/ServerOfflineCard';
import { API_BASE_URL } from '../utils/constants';

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
    const timeout = setTimeout(() => controller.abort(), 8000);
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
    poll();

    const startPolling = (fast: boolean) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(async () => {
        const status = await poll();

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
