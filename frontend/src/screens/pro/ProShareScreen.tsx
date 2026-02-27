import React, { useState } from 'react';
import { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast?: (id: string) => void;
}

function generateQRMatrix(text: string, size: number = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          if (row + r < size && col + c < size) matrix[row + r][col + c] = true;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!matrix[r][c] && !(r < 9 && c < 9) && !(r < 9 && c > size - 9) && !(r > size - 9 && c < 9)) {
        matrix[r][c] = ((hash ^ (r * 17 + c * 13)) & 1) === 1;
      }
    }
  }
  return matrix;
}

export default function ProShareScreen({ go, state, showToast }: Props) {
  const [copied, setCopied] = useState(false);
  const proId = 'demo42';
  const profileUrl = `https://nexus.app/pro/${proId}`;
  const proName = state.proData?.name || 'Votre profil';
  const proCategory = state.proData?.categorie || 'Professionnel';
  const proCity = state.proData?.ville || 'Suisse';

  const qrMatrix = generateQRMatrix(profileUrl, 21);
  const cellSize = 8;
  const qrSize = 21 * cellSize;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      showToast('Lien copie dans le presse-papiers', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier le lien', 'error');
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Reservez votre RDV avec moi sur NEXUS: ${profileUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleSMS = () => {
    const msg = encodeURIComponent(`Reservez votre RDV avec moi: ${profileUrl}`);
    window.open(`sms:?body=${msg}`, '_blank');
  };

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      showToast('Lien copie — collez-le dans votre bio Instagram', 'info');
    } catch {
      showToast('Copiez ce lien: ' + profileUrl, 'info');
    }
  };

  const shareOptions = [
    {
      label: 'Copier le lien',
      icon: copied ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#F2D06B" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#F2D06B" strokeWidth="2"/></svg>
      ),
      onClick: handleCopyLink,
    },
    {
      label: 'WhatsApp',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#00D97A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      onClick: handleWhatsApp,
    },
    {
      label: 'SMS',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#5B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      onClick: handleSMS,
    },
    {
      label: 'Instagram',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#FF3D5A" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="#FF3D5A" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#FF3D5A" strokeWidth="2" strokeLinecap="round"/></svg>
      ),
      onClick: handleInstagram,
    },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, background: 'rgba(5,5,7,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 10 }}>
        <button onClick={() => go('pro_dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#9898B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8', marginLeft: 8 }}>Partager mon profil</span>
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 32 }}>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>

          {/* Profile preview card */}
          <div style={{ width: '100%', maxWidth: 320, background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ height: 100, background: 'linear-gradient(135deg, #1C1C26, #0D0D13)', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=320&h=100&fit=crop"
                alt="cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
              />
              <div style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: '50%', border: '3px solid #F2D06B', background: '#1C1C26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 20, color: '#F2D06B' }}>
                {proName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div style={{ paddingTop: 36, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8' }}>{proName}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#9898B4', marginTop: 2 }}>{proCategory} · {proCity}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F2D06B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F2D06B' }}>4.9</span>
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#54546C', marginTop: 8 }}>nexus.app/pro/{proId}</div>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
              {qrMatrix.map((row, ri) =>
                row.map((cell, ci) =>
                  cell ? (
                    <rect
                      key={`${ri}-${ci}`}
                      x={ci * cellSize}
                      y={ri * cellSize}
                      width={cellSize - 1}
                      height={cellSize - 1}
                      fill="#050507"
                      rx={1}
                    />
                  ) : null
                )
              )}
            </svg>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#9898B4' }}>Scannez pour reserver</div>
          </div>

          {/* Share options */}
          <div style={{ width: '100%', maxWidth: 320 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 12 }}>Partager via</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {shareOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={opt.onClick}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14,
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'background 150ms',
                  }}
                >
                  {opt.icon}
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#F4F4F8' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
