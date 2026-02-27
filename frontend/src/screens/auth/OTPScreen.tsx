import React, { useState, useEffect, useRef } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import BtnPrimary from '../../components/BtnPrimary';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function OTPScreen({ state, go, update, showToast }: Props) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+41');
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Guard: if no role, go back to role selection
  useEffect(() => {
    if (!state.role) {
      go('role');
    }
  }, [state.role]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCountdown]);

  if (!state.role) return null;

  const validatePhone = (val: string) => {
    if (!val || val === '+41') return 'Veuillez entrer votre numero de telephone';
    if (!/^\+41[0-9]{9}$/.test(val)) return 'Format invalide. Exemple: +41791234567';
    return '';
  };

  const handleSendCode = () => {
    const err = validatePhone(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('code');
      setResendCountdown(60);
      showToast('Code envoye (demo: entrez 1234)', 'sms');
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    // Auto-verify when all 4 digits entered
    if (newCode.every(d => d !== '') && newCode.join('').length === 4) {
      setTimeout(() => verifyCode(newCode.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyCode = (codeStr: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Connexion reussie', 'success');
      if (state.role === 'client') go('explorer');
      else if (state.role === 'pro') go('pro_dashboard');
      else go('admin_dashboard');
    }, 800);
  };

  const handleVerify = () => {
    const codeStr = code.join('');
    if (codeStr.length < 4) {
      showToast('Entrez les 4 chiffres du code', 'error');
      return;
    }
    verifyCode(codeStr);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header
        showBack
        onBack={() => {
          if (step === 'code') {
            setStep('phone');
            setCode(['', '', '', '']);
          } else {
            go('role');
          }
        }}
        title={step === 'phone' ? 'Votre numero' : 'Code de verification'}
        onLogoClick={() => go('login')}
      />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        overscrollBehavior: 'contain',
        paddingTop: 72,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {step === 'phone' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#F4F4F8',
                  margin: 0,
                  letterSpacing: '-0.03em',
                }}>
                  Entrez votre numero
                </h2>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#9898B4',
                  marginTop: 8,
                  lineHeight: 1.5,
                }}>
                  Nous vous enverrons un code de verification
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#9898B4',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Numero de telephone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="+41791234567"
                  style={{
                    width: '100%',
                    height: 52,
                    background: '#0D0D13',
                    border: `1px solid ${phoneError ? '#FF3D5A' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12,
                    padding: '0 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 16,
                    color: '#F4F4F8',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 150ms',
                  }}
                  onFocus={e => {
                    if (!phoneError) e.target.style.borderColor = 'rgba(242,208,107,0.4)';
                  }}
                  onBlur={e => {
                    if (!phoneError) e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                />
                {phoneError && (
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: '#FF3D5A',
                    marginTop: 6,
                  }}>
                    {phoneError}
                  </p>
                )}
              </div>

              <BtnPrimary
                label="Envoyer le code"
                onClick={handleSendCode}
                loading={loading}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h2 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#F4F4F8',
                  margin: 0,
                  letterSpacing: '-0.03em',
                }}>
                  Code de verification
                </h2>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#9898B4',
                  marginTop: 8,
                  lineHeight: 1.5,
                }}>
                  Code envoye au {phone}
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#9898B4',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  Code a 4 chiffres
                </label>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={inputRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      style={{
                        width: 64,
                        height: 64,
                        background: '#0D0D13',
                        border: `1px solid ${digit ? 'rgba(242,208,107,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 14,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: 24,
                        color: '#F4F4F8',
                        textAlign: 'center',
                        outline: 'none',
                        transition: 'border-color 150ms',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(242,208,107,0.6)'; }}
                      onBlur={e => { e.target.style.borderColor = digit ? 'rgba(242,208,107,0.4)' : 'rgba(255,255,255,0.08)'; }}
                    />
                  ))}
                </div>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  color: '#54546C',
                  textAlign: 'center',
                  marginTop: 12,
                }}>
                  Mode demo: entrez n'importe quel code a 4 chiffres
                </p>
              </div>

              <BtnPrimary
                label="Verifier le code"
                onClick={handleVerify}
                loading={loading}
                disabled={code.some(d => d === '')}
              />

              <div style={{ textAlign: 'center' }}>
                {resendCountdown > 0 ? (
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    color: '#54546C',
                  }}>
                    Renvoyer dans {resendCountdown}s
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setResendCountdown(60);
                      showToast('Code renvoye', 'sms');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#F2D06B',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Renvoyer le code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
