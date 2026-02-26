import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, Actor } from '@dfinity/agent';
import type { Identity } from '@dfinity/agent';

const IC_HOST = 'https://ic0.app';
const II_URL = 'https://identity.ic0.app';

let authClientInstance: AuthClient | null = null;

async function getAuthClient(): Promise<AuthClient> {
  if (!authClientInstance) {
    authClientInstance = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });
  }
  return authClientInstance;
}

export async function login(): Promise<Identity> {
  const client = await getAuthClient();
  return new Promise((resolve, reject) => {
    client.login({
      identityProvider: II_URL,
      maxTimeToLive: BigInt(30 * 24 * 60 * 60) * BigInt(1_000_000_000),
      onSuccess: () => {
        const identity = client.getIdentity();
        resolve(identity);
      },
      onError: (err) => {
        reject(new Error(err ?? 'Internet Identity login failed'));
      },
    });
  });
}

export async function logout(): Promise<void> {
  const client = await getAuthClient();
  await client.logout();
  authClientInstance = null;
}

export async function isAuthenticated(): Promise<boolean> {
  const client = await getAuthClient();
  return client.isAuthenticated();
}

export function getIdentity(): Identity | null {
  if (!authClientInstance) return null;
  const identity = authClientInstance.getIdentity();
  if (identity.getPrincipal().isAnonymous()) return null;
  return identity;
}

export function getPrincipal(): string | null {
  const identity = getIdentity();
  if (!identity) return null;
  return identity.getPrincipal().toString();
}

export function createActor<T>(canisterId: string, idlFactory: unknown): T {
  const identity = getIdentity();
  const agent = new HttpAgent({
    host: IC_HOST,
    identity: identity ?? undefined,
  });

  return Actor.createActor(idlFactory as Parameters<typeof Actor.createActor>[0], {
    agent,
    canisterId,
  }) as T;
}
