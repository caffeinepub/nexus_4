const PAYREXX_INSTANCE = import.meta.env.VITE_PAYREXX_INSTANCE as string;
const PAYREXX_SECRET = import.meta.env.VITE_PAYREXX_SECRET as string;

function buildPayrexxBaseUrl(): string {
  const instance = PAYREXX_INSTANCE || 'nexus';
  return `https://api.payrexx.com/v1.0`;
}

function buildPayrexxGatewayUrl(instance: string): string {
  return `https://${instance}.payrexx.com/pay`;
}

/**
 * Build a HMAC-SHA256 signature for Payrexx requests.
 * In a production environment this should be done server-side.
 * Here we build the URL with the required parameters.
 */
function buildQueryString(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

/**
 * Creates a Payrexx subscription payment URL for a pro.
 * Uses TWINT exclusively as the payment method (psp[0]=twint).
 *
 * @param proId - The pro's unique identifier
 * @param email - The pro's email address
 * @param phone - The pro's phone number (+41 format)
 * @returns A Payrexx payment URL string
 */
export function createSubscriptionUrl(proId: string, email: string, phone: string): string {
  const instance = PAYREXX_INSTANCE || 'nexus';
  const baseUrl = buildPayrexxGatewayUrl(instance);

  const params: Record<string, string | number> = {
    'psp[0]': 'twint',
    'referenceId': `sub_${proId}_${Date.now()}`,
    'purpose': 'Abonnement NEXUS Pro - 19.90 CHF/mois',
    'amount': '1990',
    'currency': 'CHF',
    'vatRate': '0',
    'sku': `nexus_subscription_${proId}`,
    'preAuthorization': '0',
    'reservation': '0',
    'pm[0]': 'twint',
    'successRedirectUrl': `${window.location.origin}/#pro_success`,
    'failedRedirectUrl': `${window.location.origin}/#pro_subscription`,
    'cancelRedirectUrl': `${window.location.origin}/#pro_subscription`,
    'fields[email][value]': email,
    'fields[phone][value]': phone,
    'fields[custom_field_1][value]': proId,
    'fields[custom_field_1][name]': 'pro_id',
    'apiSignature': PAYREXX_SECRET || '',
  };

  return `${baseUrl}?${buildQueryString(params)}`;
}

/**
 * Creates a Payrexx one-time booking payment URL.
 * Uses TWINT exclusively as the payment method (psp[0]=twint).
 *
 * @param bookingId - The booking's unique identifier
 * @param montant - The amount in CHF (e.g. 55.00)
 * @param serviceName - The name of the service being booked
 * @param email - The client's email address
 * @returns A Payrexx payment URL string
 */
export function createBookingUrl(
  bookingId: string,
  montant: number,
  serviceName: string,
  email: string
): string {
  const instance = PAYREXX_INSTANCE || 'nexus';
  const baseUrl = buildPayrexxGatewayUrl(instance);

  const amountInCentimes = Math.round(montant * 100);

  const params: Record<string, string | number> = {
    'psp[0]': 'twint',
    'referenceId': `booking_${bookingId}`,
    'purpose': `NEXUS - ${serviceName}`,
    'amount': amountInCentimes,
    'currency': 'CHF',
    'vatRate': '0',
    'sku': `nexus_booking_${bookingId}`,
    'preAuthorization': '0',
    'reservation': '0',
    'pm[0]': 'twint',
    'successRedirectUrl': `${window.location.origin}/#booking_5`,
    'failedRedirectUrl': `${window.location.origin}/#booking_4`,
    'cancelRedirectUrl': `${window.location.origin}/#booking_4`,
    'fields[email][value]': email,
    'fields[custom_field_1][value]': bookingId,
    'fields[custom_field_1][name]': 'booking_id',
    'apiSignature': PAYREXX_SECRET || '',
  };

  return `${baseUrl}?${buildQueryString(params)}`;
}
