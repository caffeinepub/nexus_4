import React, { useState, useRef, useEffect } from 'react';
import { IconArrowLeft, IconPhone } from '../../components/icons';
import { sendOTP, verifyOTP } from '../../lib/twilio';
import type { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface OTPScreenProps {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
  state: { role: 'client' | 'pro' | 'admin' | null; userPhone: string };
}

function isValidSwissPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^\+41[0-9]{9}$/.test(cleaned);
}

export default function OTPScreen({ go, update, showToast, state }: OTPScreenProps) {
  // Guard: if role is null, redirect back to role selection immediately
  useEffect(() => {
    if (state.role === null) {
      go('role');
    }
  }, [state.role, go]);

  const [phone, setPhone] = useState(state.userPhone || '+41');
  const [codeSent, setCodeSent] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // Do not render content if role is null
  if (state.role === null) {
    return null;
  }

  const startCooldown = () => {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    setError('');
    if (!isValidSwissPhone(phone)) {
      setError('Numero invalide. Format: +41 XX XXX XX XX');
      return;
    }
    setSending(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        setCodeSent(true);
        startCooldown();
        showToast('Code envoye par SMS', 'success');
        setTimeout(() => inputRefs[0].current?.focus(), 300);
      } else {
        setError(result.error || 'Erreur lors de l envoi du code.');
      }
    } catch {
      setError('Erreur reseau. Veuillez reessayer.');
    } finally {
      setSending(false);
    }
  };

  const handleDigitChange = async (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError('');

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (newDigits.every(d => d !== '') && digit) {
      const code = newDigits.join('');
      await handleVerify(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setVerifying(true);
    setError('');
    try {
      const result = await verifyOTP(phone, code);
      if (result.success) {
        update({ userPhone: phone, isAuthenticated: true });
        showToast('Verification reussie', 'success');
        if (state.role === 'pro') {
          go('pro_dashboard');
        } else {
          go('explorer');
        }
      } else {
        setError(result.error || 'Code invalide. Veuillez reessayer.');
        setDigits(['', '', '', '']);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      }
    } catch {
      setError('Erreur de verification. Veuillez reessayer.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setDigits(['', '', '', '']);
    setError('');
    await handleSend();
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#050507',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',
        paddingRight: '16px',
        zIndex: 100,
        background: 'rgba(5,5,7,0.85)',
        backdropFilter: 'blur(20px)',
      }}>
        <button
          onClick={() => go('role')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#121219',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconArrowLeft size={20} color="#F4F4F8" />
        </button>
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          color: '#F4F4F8',
          marginRight: '40px',
        }}>
          Verification
        </div>
      </div>

      {/* Scroll zone */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '72px 24px 32px',
      }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '22px',
          color: '#F4F4F8',
          marginBottom: '8px',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          Votre numero de telephone
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          color: '#54546C',
          marginBottom: '28px',
          animation: 'fadeIn 0.4s ease 0.05s both',
        }}>
          Nous vous enverrons un code de verification par SMS
        </div>

        {/* Phone input */}
        <div style={{
          position: 'relative',
          marginBottom: '16px',
          animation: 'fadeIn 0.4s ease 0.1s both',
        }}>
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}>
            <IconPhone size={18} color="#54546C" />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={e => {
              const val = e.target.value;
              if (!val.startsWith('+41')) {
                setPhone('+41');
              } else {
                setPhone(val);
              }
            }}
            placeholder="+41 XX XXX XX XX"
            disabled={codeSent}
            style={{
              width: '100%',
              height: '52px',
              paddingLeft: '44px',
              paddingRight: '16px',
              background: '#121219',
              border: `1px solid ${error && !codeSent ? '#FF3D5A' : '#1C1C26'}`,
              borderRadius: '14px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: codeSent ? '#54546C' : '#F4F4F8',
              outline: 'none',
            }}
          />
        </div>

        {/* Send button */}
        {!codeSent && (
          <button
            onClick={handleSend}
            disabled={sending || !isValidSwissPhone(phone)}
            style={{
              width: '100%',
              height: '54px',
              borderRadius: '16px',
              background: sending || !isValidSwissPhone(phone)
                ? '#1C1C26'
                : 'linear-gradient(135deg, #F2D06B 0%, #D4A050 100%)',
              color: '#050507',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              cursor: sending || !isValidSwissPhone(phone) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px',
              animation: 'fadeIn 0.4s ease 0.15s both',
            }}
          >
            {sending ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
            ) : null}
            {sending ? 'Envoi en cours...' : 'Envoyer le code'}
          </button>
        )}

        {/* OTP inputs */}
        {codeSent && (
          <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              color: '#9898B4',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              Code envoye au {phone}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '24px',
            }}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  disabled={verifying}
                  style={{
                    width: '64px',
                    height: '72px',
                    borderRadius: '16px',
                    background: digit ? 'rgba(242,208,107,0.08)' : '#121219',
                    border: `2px solid ${digit ? '#F2D06B' : error ? '#FF3D5A' : '#1C1C26'}`,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: '28px',
                    color: '#F4F4F8',
                    textAlign: 'center',
                    outline: 'none',
                    caretColor: '#F2D06B',
                    transition: 'border-color 150ms ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {verifying && (
              <div style={{
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#54546C',
                marginBottom: '16px',
              }}>
                Verification en cours...
              </div>
            )}

            {/* Resend */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: cooldown > 0 ? '#2E2E3E' : '#F2D06B',
                  background: 'none',
                  border: 'none',
                  cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                  padding: '8px',
                  minHeight: '44px',
                }}
              >
                {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : 'Renvoyer le code'}
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '13px',
            color: '#FF3D5A',
            textAlign: 'center',
            marginTop: '12px',
            padding: '12px 16px',
            background: 'rgba(255,61,90,0.08)',
            borderRadius: '12px',
            animation: 'fadeIn 0.3s ease forwards',
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
