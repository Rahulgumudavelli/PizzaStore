import React, { useEffect, useRef } from 'react';

/* ─── per-toast type metadata ─────────────────────────────────────── */
const TYPE_META = {
  ORDER_PLACED: {
    icon: 'bi-check-circle-fill',
    title: 'Order Placed!',
    accent: '#ffffff',
    bg: '#111111',
    textColor: '#ffffff',
  },
  ORDER_STATUS_UPDATE: {
    icon: 'bi-bell-fill',
    title: 'Order Update',
    accent: '#ffffff',
    bg: '#111111',
    textColor: '#ffffff',
  },
  ORDER_CANCELLED: {
    icon: 'bi-x-circle-fill',
    title: 'Order Cancelled',
    accent: '#ffffff',
    bg: '#111111',
    textColor: '#ffffff',
  },
};

const DEFAULT_META = {
  icon: 'bi-info-circle-fill',
  title: 'Notification',
  accent: '#ffffff',
  bg: '#111111',
  textColor: '#ffffff',
};

function getMeta(type) {
  return TYPE_META[type] || DEFAULT_META;
}

/* ─── Single Toast ────────────────────────────────────────────────── */
function Toast({ id, type, message, onClose }) {
  const { icon, title, accent, bg, textColor } = getMeta(type);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timerRef.current);
  }, [id, onClose]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        backgroundColor: bg,
        border: `1px solid ${accent}33`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '10px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        animation: 'toast-slide-in 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        minWidth: '310px',
        maxWidth: '370px',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Icon bubble */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          backgroundColor: `rgba(255,255,255,0.1)`,
          border: `1px solid rgba(255,255,255,0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          flexShrink: 0,
        }}
      >
        <i className={`bi ${icon}`} style={{ color: textColor }}></i>
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: textColor, marginBottom: 3, letterSpacing: '0.03em' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
          {message}
        </div>
      </div>

      {/* Close btn */}
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '1.1rem',
          padding: 0,
          lineHeight: 1,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
        aria-label="Close notification"
      >
        ×
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          borderRadius: '0 0 12px 12px',
          backgroundColor: accent,
          animation: 'toast-progress 5s linear forwards',
          width: '100%',
        }}
      />
    </div>
  );
}

/* ─── Toast Container — TOP RIGHT ─────────────────────────────────── */
function NotificationToast({ toasts, onClose }) {
  return (
    <>
      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateX(60px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0)    scale(1);   }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: 76,        /* just below the 64px navbar */
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast id={t.id} type={t.type} message={t.message} onClose={onClose} />
          </div>
        ))}
      </div>
    </>
  );
}

export default NotificationToast;
