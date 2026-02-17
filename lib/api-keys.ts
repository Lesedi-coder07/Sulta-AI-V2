import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

const API_KEY_PREFIX = 'sulta_sk_';

type UserWithApiKey = {
  uid: string;
  email?: string;
  agents?: string[];
};

export function generateApiKey() {
  const token = crypto.randomBytes(24).toString('base64url');
  return `${API_KEY_PREFIX}${token}`;
}

export function maskApiKey(key: string) {
  if (!key || key.length < 12) return '********';
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

export function getApiKeyFromRequest(req: Request) {
  const fromHeader = req.headers.get('x-api-key')?.trim();
  if (fromHeader) return fromHeader;

  const authHeader = req.headers.get('authorization')?.trim();
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }

  return '';
}

export async function findUserByApiKey(apiKey: string): Promise<UserWithApiKey | null> {
  if (!apiKey) return null;

  const snapshot = await adminDb
    .collection('users')
    .where('apiKey', '==', apiKey)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data() || {};

  return {
    uid: userDoc.id,
    email: typeof userData.email === 'string' ? userData.email : undefined,
    agents: Array.isArray(userData.agents) ? userData.agents : [],
  };
}

export async function setUserApiKey(userId: string, apiKey: string) {
  await adminDb.collection('users').doc(userId).set(
    {
      apiKey,
      apiKeyUpdatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
