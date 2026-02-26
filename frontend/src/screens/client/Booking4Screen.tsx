import React, { useState } from 'react';
import { IconArrowLeft, IconCalendar, IconMapPin, IconClock, IconTwint } from '../../components/icons';
import { createBookingUrl } from '../../lib/payrexx';
import type { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface Booking4Props {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
  state: GlobalState;
}

function ProgressNodes({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4].map((n, i) => (
        <React.Fragment key={n}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: n <= step ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)' : 'var(--d4)',
            border: `2px solid ${n <= step ? 'var(--gold)' : 'var(--d4)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px',
            color: n <= step ? '#050507' : 'var(--t4)', flexShrink: 0,
          }}>{n}</div>
          {i < 3 && <div style={{ flex: 1, height: '2px', background: n < step ? 'var(--gold)' : 'var(--d4)', minWidth: '20px' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Booking4Screen({ go, update, showToast, state }: Booking4Props) {
  const [paying, setPaying] = useState(false);
  const { bookingData, selectedPro } = state;

  const handlePay = async () => {
    setPaying(true);
    try {
      const bookingId = bookingData.bookingId || `bk-${Date.now()}`;
      const montant = bookingData.montant || 0;
      const url = createBookingUrl(
        bookingId,
        montant,
        bookingData.serviceName,
        state.userEmail || 'client@nexus.app'
      );
      go('booking_confirm');
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    } catch {
      showToast('Erreur lors de la creation du paiement', 'error');
      setPaying(false);
    }
  };

  const rows = [
    { icon: <IconClock size={18} color="var(--t3)" />, label: 'Service', value: bookingData.serviceName || 'Service' },
    { icon: <IconCalendar size={18} color="var(--t3)" />, label: 'Date', value: `${bookingData.date} ${bookingData.heure}` },
    { icon: <IconMapPin size={18} color="var(--t3)" />, label: 'Adresse', value: `${bookingData.adresse}, ${bookingData.ville}` },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--void)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '56px',
        display: 'flex', alignItems: 'center', paddingLeft: '8px', paddingRight: '16px',
        gap: '12px', zIndex: 100, background: 'rgba(5,5,7,0.90)', backdropFilter: 'blur(20px)',
      }}>
        <button onClick={() => go('booking_3')} style={{
          width: '40px', height: '40px', borderRadius: '12px', background: 'var(--d3)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <IconArrowLeft size={20} color="var(--t1)" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--t3)', marginBottom: '2px' }}>
            Etape 4 sur 4
          </div>
          <ProgressNodes step={4} />
        </div>
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '72px 16px 16px' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px',
          color: 'var(--t1)', marginBottom: '6px', animation: 'fadeIn 0.4s ease forwards',
        }}>
          Recapitulatif
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px',
          color: 'var(--t3)', marginBottom: '24px', animation: 'fadeIn 0.4s ease 0.05s both',
        }}>
          Verifiez les details avant de payer
        </div>

        {/* Pro info */}
        <div style={{
          background: 'var(--d2)', borderRadius: 16, padding: '16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #1A1A2E, #2D2D4E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#C9A84C', flexShrink: 0,
          }}>
            {selectedPro?.prenom?.[0] || 'E'}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
              {selectedPro?.prenom || 'Expert'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
              {selectedPro?.categorie || 'Beaute'} · {selectedPro?.ville || ''}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ background: 'var(--d2)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBottom: i < rows.length - 1 ? 12 : 0,
              marginBottom: i < rows.length - 1 ? 12 : 0,
              borderBottom: i < rows.length - 1 ? '1px solid var(--d3)' : 'none',
            }}>
              {row.icon}
              <div>
                <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 500 }}>{row.label}</div>
                <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600, marginTop: 1 }}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          background: 'rgba(242,208,107,0.06)', border: '1px solid rgba(242,208,107,0.2)',
          borderRadius: 16, padding: '16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)' }}>Total</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>
            {bookingData.montant || 0} CHF
          </div>
        </div>

        {/* TWINT badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px', background: 'var(--d2)', borderRadius: 12,
        }}>
          <IconTwint size={20} color="var(--t3)" />
          <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>
            Paiement securise via TWINT
          </span>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flexShrink: 0, padding: '12px 16px', background: 'rgba(5,5,7,0.97)',
        backdropFilter: 'blur(20px)', borderTop: '1px solid var(--d3)',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={handlePay}
          disabled={paying}
          style={{
            width: '100%', height: '58px', borderRadius: '18px',
            background: paying ? 'var(--d4)' : 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)',
            color: paying ? 'var(--t4)' : '#050507',
            fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px',
            border: 'none', cursor: paying ? 'not-allowed' : 'pointer',
            boxShadow: paying ? 'none' : '0 8px 32px rgba(242,208,107,0.28)',
            transition: 'all 200ms ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {paying ? 'Redirection...' : `Payer ${bookingData.montant || 0} CHF via TWINT`}
        </button>
      </div>
    </div>
  );
}
