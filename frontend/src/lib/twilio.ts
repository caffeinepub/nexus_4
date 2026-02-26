/**
 * Twilio SMS integration stub.
 * In production, these calls would go through a Cloudflare Worker or
 * backend canister method that proxies to the Twilio REST API.
 */

export interface OTPResult {
  success: boolean;
  error?: string;
}

/**
 * Send an OTP code to the given phone number via Twilio Verify.
 * Stub: logs the call and returns success.
 */
export async function sendOTP(phone: string): Promise<OTPResult> {
  console.log('[Twilio] sendOTP →', phone);
  // TODO: POST to /api/otp/send with { phone }
  // which proxies to: https://verify.twilio.com/v2/Services/{ServiceSid}/Verifications
  return { success: true };
}

/**
 * Verify the OTP code entered by the user.
 * Stub: any 4-digit code is accepted in development.
 */
export async function verifyOTP(phone: string, code: string): Promise<OTPResult> {
  console.log('[Twilio] verifyOTP →', phone, code);
  // TODO: POST to /api/otp/verify with { phone, code }
  // which proxies to: https://verify.twilio.com/v2/Services/{ServiceSid}/VerificationCheck
  if (code.length === 4 && /^\d{4}$/.test(code)) {
    return { success: true };
  }
  return { success: false, error: 'Code invalide. Veuillez reessayer.' };
}
