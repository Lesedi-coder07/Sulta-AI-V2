import { adminDb } from '@/lib/firebase-admin';
import { findUserByApiKey, getApiKeyFromRequest } from '@/lib/api-keys';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function GET(req: Request) {
  try {
    const apiKey = getApiKeyFromRequest(req);
    if (!apiKey) {
      return jsonResponse({ error: 'Missing API key' }, 401);
    }

    const user = await findUserByApiKey(apiKey);
    if (!user) {
      return jsonResponse({ error: 'Invalid API key' }, 401);
    }

    const agentIds = Array.isArray(user.agents) ? user.agents : [];
    if (agentIds.length === 0) {
      return jsonResponse({ agents: [] });
    }

    const docs = await Promise.all(
      agentIds.map((agentId) => adminDb.collection('agents').doc(agentId).get())
    );

    const agents = docs
      .filter((doc) => doc.exists)
      .map((doc) => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          name: data.name || 'Unnamed Agent',
          type: data.type || 'text',
          description: data.description || '',
          isPublic: Boolean(data.isPublic),
          createdAt: data.createdAt || null,
        };
      });

    return jsonResponse({ agents });
  } catch (error) {
    console.error('Agent listing API error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
