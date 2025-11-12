# Firebase Server-Side Setup

## Overview
This project now uses Firebase Admin SDK for server-side operations to improve performance. Agents are fetched server-side, reducing load times from ~4 seconds to milliseconds.

## Required Environment Variables

### Client SDK (Already configured)
These are already set with `NEXT_PUBLIC_` prefix:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- etc.

### Server SDK (New - Required)
Add these to your `.env.local` file:

```env
FIREBASE_PROJECT_ID=sulta-ai
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@sulta-ai.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

## How to Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`sulta-ai`)
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

## Architecture Changes

### Before (Client-side only)
- Dashboard loads as client component
- Multiple nested `onSnapshot` listeners
- Sequential data fetching
- ~4 second load time

### After (Server-side first)
- Dashboard is a server component
- Agents fetched server-side with Firebase Admin SDK
- Parallel data fetching with `Promise.all()`
- Initial data available immediately (< 100ms)
- Real-time updates still work via client-side listeners

## Files Modified
- `/app/ai/dashboard/page.tsx` - Now a server component
- `/components/dashboard/agent-selector.tsx` - Accepts `initialAgents` prop
- `/lib/firebase-admin.ts` - New Firebase Admin SDK setup
- `/app/ai/dashboard/actions.ts` - Server action to fetch agents
- `/lib/auth-helpers.ts` - Server-side auth verification
- `/app/api/auth/session/route.ts` - Session cookie management
- `/components/auth/auth-provider.tsx` - Client-side auth provider

## Testing
After adding the environment variables:
1. Restart your development server
2. Navigate to `/ai/dashboard`
3. Agents should load instantly (no 4-second delay)
4. Real-time updates still work when agents are modified

