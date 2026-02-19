import React, { useState, useEffect, useRef } from 'react';

export type ServerStatus =
  | 'online'       // all good
  | 'waking'       // we sent a request; server hasn't responded yet (Render cold-start)
  | 'restarting'   // server responded but with 5xx (deploying/restarting)
  | 'offline';     // network-level failure (no response at all)

interface ServerOfflineCardProps {
  status: ServerStatus;
  message?: string;
  onRetry?: () => void;
}

const ELLIPSIS_FRAMES = ['.', '..', '...'];

export default function ServerOfflineCard({ status, onRetry }: ServerOfflineCardProps) {
  const [ellipsis, setEllipsis] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'waking') {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setEllipsis(e => (e + 1) % ELLIPSIS_FRAMES.length);
        setElapsed(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const content: Record<ServerStatus, {
    dot: string;
    heading: string;
    body: React.ReactNode;
    btn?: { label: string; action: () => void };
  }> = {
    online: {
      dot: 'bg-emerald-500',
      heading: '',
      body: null,
    },
    waking: {
      dot: 'bg-amber-400 animate-pulse',
      heading: 'Waking the server',
      body: (
        <>
          <p className="text-sm text-emerald-900/60 mb-1">
            The server went to sleep due to inactivity.
          </p>
          <p className="text-sm text-emerald-900/60">
            Re-establishing connection, this may take up to 60 seconds
            <span className="font-bold text-emerald-800 ml-0.5">{ELLIPSIS_FRAMES[ellipsis]}</span>
          </p>
          {elapsed >= 30 && (
            <p className="text-xs text-emerald-900/40 mt-3">
              Still starting — Render free tier can take a moment on first request.
            </p>
          )}
        </>
      ),
    },
    restarting: {
      dot: 'bg-amber-500 animate-pulse',
      heading: 'Server is restarting',
      body: (
        <p className="text-sm text-emerald-900/60">
          The server is being redeployed or restarted. This usually resolves in under a minute.
          Please wait and the page will refresh automatically.
        </p>
      ),
    },
    offline: {
      dot: 'bg-rose-500',
      heading: 'Could not reach the server',
      body: (
        <p className="text-sm text-emerald-900/60">
          {'Network error — the backend is unreachable. Check your connection or try again.'}
        </p>
      ),
      btn: { label: 'Retry connection', action: onRetry ?? (() => window.location.reload()) },
    },
  };

  if (status === 'online') return null;

  const { dot, heading, body, btn } = content[status];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)] p-10 max-w-lg mx-auto">
        <div className="flex items-start gap-4">
          <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-950 mb-2">{heading}</p>
            <div className="space-y-1">{body}</div>
            {btn && (
              <button
                onClick={btn.action}
                className="mt-6 px-5 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all"
              >
                {btn.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
