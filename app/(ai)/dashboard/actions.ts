'use server'

import { adminDb } from '@/lib/firebase-admin';
import { Agent } from '@/types/agent';
import { PipelineGraph } from '@/types/playground';
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
        personality: agentData?.personality,
        tone: agentData?.tone,
        expertise: agentData?.expertise,
        contextMemory: agentData?.contextMemory,
        extendedThinking: agentData?.extendedThinking,
        guardrails: agentData?.guardrails,
        llmConfig: agentData?.llmConfig,
        customApiTool: agentData?.customApiTool,
        customSystemPrompt: agentData?.customSystemPrompt,
        extraContext: agentData?.extraContext || '',
        tools: Array.isArray(agentData?.tools) ? agentData.tools : [],
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

export async function updateAgentAnalytics(agentId: string, totalQueries: number, tokensUsed: number, totalChats: number = 0) {
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

/** Load the saved pipeline graph for an agent (null if none saved yet) */
export async function getAgentGraph(agentId: string): Promise<PipelineGraph | null> {
  try {
    const doc = await adminDb.collection('agents').doc(agentId).get();
    const graph = doc.data()?.pipelineGraph;
    if (graph && Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
      return graph as PipelineGraph;
    }
    return null;
  } catch {
    return null;
  }
}

/** Save the pipeline graph and tools for an agent in one write */
export async function saveAgentPlayground(
  agentId: string,
  graph: PipelineGraph,
  tools: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!agentId) return { success: false, error: 'Missing agent ID' };
    await adminDb.collection('agents').doc(agentId).update({ pipelineGraph: graph, tools });
    return { success: true };
  } catch (error) {
    console.error('Error saving agent playground:', error);
    return { success: false, error: 'Failed to save' };
  }
}

export async function updateAgentTools(agentId: string, tools: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!agentId) return { success: false, error: 'Missing agent ID' };
    await adminDb.collection('agents').doc(agentId).update({ tools });
    return { success: true };
  } catch (error) {
    console.error('Error updating agent tools:', error);
    return { success: false, error: 'Failed to save tools' };
  }
}

export async function deleteAgent(agentId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!agentId || !userId) {
      return { success: false, error: 'Missing agent ID or user ID' };
    }

    // Delete agent document
    await adminDb.collection('agents').doc(agentId).delete();

    // Remove agent from user's agents array
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      agents: FieldValue.arrayRemove(agentId)
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting agent:', error);
    return { success: false, error: 'Failed to delete agent' };
  }
}
