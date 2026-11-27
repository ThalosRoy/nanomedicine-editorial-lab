import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PUBLIC_SHARE_URL } from '../../config/setsData';

interface QRModalProps {
  open: boolean;
  onClose: () => void;
}

export function QRModal({ open, onClose }: QRModalProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const targetUrl =
    typeof window !== 'undefined' &&
    window.location.protocol.startsWith('http') &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
      ? window.location.href.split('?')[0]
      : PUBLIC_SHARE_URL;

  useEffect(() => {
    if (!open) return;
    let active = true;
    QRCode.toDataURL(targetUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#07090e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [open, targetUrl]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard might be unavailable in restricted contexts
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Código QR para acceso en salón"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(3, 7, 14, 0.78)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        className="obsidian-panel"
        style={{
          width: '100%',
          maxWidth: '21rem',
          borderRadius: '1rem',
          padding: '1.25rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal QR"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'transparent',
            border: '1px solid rgba(148,163,184,0.2)',
            color: '#94a3b8',
            borderRadius: '0.5rem',
            width: '1.75rem',
            height: '1.75rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div
          style={{
            width: '28px',
            height: '3px',
            background: '#a0ced8',
            borderRadius: '9999px',
            margin: '0 auto 0.6rem',
          }}
        />
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
          Acceso en Vivo para el Salón
        </h3>
        <p style={{ margin: '0.35rem 0 0.9rem', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
          Escanea desde tu celular o tablet para rotar, alternar el corte 3/4 e inspeccionar los 9 sets gratis en GitHub Pages.
        </p>

        <div
          style={{
            background: '#ffffff',
            padding: '0.65rem',
            borderRadius: '0.75rem',
            display: 'inline-block',
          }}
        >
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Código QR hacia Nanomedicine Editorial Lab"
              width={184}
              height={184}
              style={{ display: 'block' }}
            />
          ) : (
            <div style={{ width: 184, height: 184, display: 'grid', placeItems: 'center', color: '#07090e' }}>
              Generando QR…
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#07090e',
            border: '1px solid rgba(148,163,184,0.18)',
            borderRadius: '0.5rem',
            padding: '0.35rem 0.5rem',
          }}
        >
          <span
            className="font-mono-tech"
            style={{
              fontSize: '0.65rem',
              color: '#a0ced8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              textAlign: 'left',
            }}
          >
            {targetUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="font-mono-tech"
            style={{
              fontSize: '0.65rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '0.35rem',
              border: '1px solid rgba(160,206,216,0.35)',
              background: 'rgba(94,139,148,0.24)',
              color: '#f8fafc',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  );
}
