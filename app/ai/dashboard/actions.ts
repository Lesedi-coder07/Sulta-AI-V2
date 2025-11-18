'use server'

import { adminDb } from '@/lib/firebase-admin';
import { Agent } from '@/types/agent';
import { FieldValue } from 'firebase-admin/firestore';

export async function getAgents(userId: string): Promise<Agent[]> {
  try {
    if (!userId) {
      return [];
    }

    // Fetch user document
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return [];
    }

    const agentIds: string[] = userDoc.data()?.agents || [];
    
    if (agentIds.length === 0) {
      return [];
    }

    // Fetch all agents in parallel (much faster than sequential)
    const agentPromises = agentIds.map(async (agentId) => {
      const agentDoc = await adminDb.collection('agents').doc(agentId).get();
      
      if (!agentDoc.exists) {
        return null;
      }

      const agentData = agentDoc.data();
      return {
        id: agentId,
        name: agentData?.name || 'Unnamed Agent',
        type: agentData?.type || 'Text',
        status: agentData?.isPublic ? 'online' : 'offline',
        isPublic: agentData?.isPublic || false,
        totalQueries: agentData?.totalQueries || 0,
        tokensUsed: agentData?.tokensUsed || 0,
        totalChats: agentData?.totalChats || 0,
        description: agentData?.description,
        createdAt: agentData?.createdAt,
      } as Agent;
    });

    const agents = await Promise.all(agentPromises);
    
    // Filter out null values (agents that don't exist)
    return agents.filter((agent): agent is Agent => agent !== null);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

export async function updateAgentAnalytics(agentId: string, totalQueries: number, tokensUsed: number, totalChats: number = 0)  {
  try {
    if (!agentId) {
      return;
    }

    const agentRef = adminDb.collection('agents').doc(agentId);
    
    // Use atomic increments for thread-safe updates
    const updateData: Record<string, FieldValue> = {
      totalQueries: FieldValue.increment(totalQueries),
      tokensUsed: FieldValue.increment(tokensUsed),
    };

    // Only increment totalChats if it's greater than 0
    if (totalChats > 0) {
      updateData.totalChats = FieldValue.increment(totalChats);
    }

    await agentRef.update(updateData);
  } catch (error) {
    // Log error but don't throw - this is fire-and-forget
    console.error('Error updating agent analytics:', error);
  }
}

