import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { generateApiKey, maskApiKey, setUserApiKey } from '@/lib/api-keys';
import { adminDb } from '@/lib/firebase-admin';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getSessionUserId() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

async function ensureApiKey(userId: string) {
  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const existing = userDoc.data()?.apiKey;

  if (typeof existing === 'string' && existing.trim()) {
    return existing.trim();
  }

  const newKey = generateApiKey();
  await setUserApiKey(userId, newKey);
  return newKey;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const apiKey = await ensureApiKey(userId);
  return jsonResponse({
    apiKey,
    maskedApiKey: maskApiKey(apiKey),
  });
}

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const apiKey = generateApiKey();
  await setUserApiKey(userId, apiKey);

  return jsonResponse({
    apiKey,
    maskedApiKey: maskApiKey(apiKey),
    rotated: true,
  });
}
