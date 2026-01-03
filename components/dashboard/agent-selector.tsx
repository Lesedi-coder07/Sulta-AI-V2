"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "./agent-card";
import { auth } from "@/app/api/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/api/firebase/firebaseConfig";
import AgentOptions from "./agent-options";
import { Agent } from "@/types/agent";
import { Bot, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AgentSelectorProps {
  initialAgents: Agent[];
  userId: string;
  onAgentSelected?: (isSelected: boolean) => void;
}

export function AgentSelector({ initialAgents, userId, onAgentSelected }: AgentSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentTabOpen, setAgentTabOpen] = useState<boolean>(false);
  const router = useRouter();

  const updateSelectedAgent = (agent: Agent | null, agentTabOpen: boolean) => {
    setSelectedAgent(agent);
    setAgentTabOpen(agentTabOpen);
    onAgentSelected?.(agentTabOpen);
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Authenticated User: ", user);
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, async (snapshot) => {
          const agentIds: string[] = snapshot.data()?.agents || [];
          if (agentIds.length === 0) {
            setAgents([]);
            return;
          }

          // Set up listeners for each agent
          const unsubscribeAgents = agentIds.map((agentId) => {
            const agentDocRef = doc(db, "agents", agentId);
            return onSnapshot(agentDocRef, (agentSnapshot) => {
              const agentData = agentSnapshot.data();
              if (agentData) {
                const agent: Agent = {
                  id: agentId,
                  name: agentData.name,
                  type: agentData.type,
                  status: agentData.isPublic ? "online" : "offline",
                  isPublic: agentData.isPublic,
                  totalQueries: agentData.totalQueries || 0,
                  tokensUsed: agentData.tokensUsed || 0,
                  totalChats: agentData.totalChats || 0,
                  description: agentData.description,
                  createdAt: agentData.createdAt,
                };
                setAgents((prevAgents) => {
                  const otherAgents = prevAgents.filter((a) => a.id !== agentId);
                  return [...otherAgents, agent];
                });
              }
            });
          });

          // Cleanup agent listeners when agent list changes
          return () => {
            unsubscribeAgents.forEach((unsubscribe) => unsubscribe());
          };
        });

        return () => {
          unsubscribeUser();
        };
      } else {
        setAgents([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleAgentDeleted = () => {
    // Remove the deleted agent from local state
    if (selectedAgent) {
      setAgents((prevAgents) => prevAgents.filter((a) => a.id !== selectedAgent.id));
    }
  };

  return (
    agentTabOpen ? (
      <AgentOptions
        updateSelectedAgent={updateSelectedAgent}
        agent={selectedAgent as Agent}
        currentUserId={userId}
        onAgentDeleted={handleAgentDeleted}
      />
    ) : (
      <div className="w-full p-4 overflow-hidden">
        <div className="space-y-6 w-full flex flex-col">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-container p-2.5">
                <Bot className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Your AI Agents
                </h2>
                <p className="text-sm text-muted-foreground">
                  {agents.length === 0 ? 'Create your first agent to get started' : `${agents.length} agent${agents.length !== 1 ? 's' : ''} available`}
                </p>
              </div>
            </div>

            <Button
              onClick={() => router.push("/create")}
              className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Agent
            </Button>
          </div>

          {/* Agent cards grid */}
          <div className="flex flex-row flex-wrap gap-4 w-full overflow-y-auto">
            {agents.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-12 glass-card rounded-xl">
                <div className="icon-container p-4 mb-4">
                  <Bot className="h-8 w-8 text-white/60" />
                </div>
                <p className="text-muted-foreground text-center mb-4">You don't have any agents yet</p>
                <Button
                  onClick={() => router.push("/create")}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Button>
              </div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                >
                  <AgentCard
                    name={agent.name}
                    type={agent.type}
                    status={agent.isPublic ? "online" : "offline"}
                    selected={selectedAgent?.name === agent.name}
                    onClick={() => updateSelectedAgent(agent, true)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
}