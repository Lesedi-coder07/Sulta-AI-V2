import { firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import * as admin from 'firebase-admin';

// Initialize Firebase app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // In production, specify exact origin(s) for security
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const db = firestore();
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const agentRef = db.collection('agents').doc(agentId);
    const agentDoc = await agentRef.get();

    if (!agentDoc.exists) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const agentData = agentDoc.data();

    return NextResponse.json(
      { systemMessage: agentData?.systemMessage },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
    status: 500, headers: CORS_HEADERS } );
  }
}

//Im acting like im coding right now for Youtube....


