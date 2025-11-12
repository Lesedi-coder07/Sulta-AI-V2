"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "./agent-card";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/api/firebase/firebaseConfig";
import AgentOptions from "./agent-options";
import { useRouter } from "next/navigation";
import { Agent } from "@/types/agent";

interface AgentSelectorProps {
  initialAgents: Agent[];
  userId: string;
}

export function AgentSelector({ initialAgents, userId }: AgentSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentTabOpen, setAgentTabOpen] = useState<boolean>(false);

  const updateSelectedAgent = (agent: Agent | null, agentTabOpen: boolean) => {
    setSelectedAgent(agent);
    setAgentTabOpen(agentTabOpen);
  };

  useEffect(() => {
    if (!userId) return;

    // Set up real-time listener for user's agent list
    const userDocRef = doc(db, "users", userId);
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
  }, [userId]);

  const router = useRouter();

  const handlePublicAgentClick = (url: string) => {
    router.push(url);
  };

  return (
    agentTabOpen ? (
      <AgentOptions updateSelectedAgent={updateSelectedAgent} agent={selectedAgent as Agent} />
    ) : (
      <div className="w-full border-r border-none p-4 dark:border-neutral-800 dark:bg-none bg-inherit overflow-hidden">
        <div className="space-y-4 w-full flex flex-col">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Your AI Agents
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Select an agent
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-4 w-full overflow-y-auto">
            {agents.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You don't have any agents yet
              </p>
            ) : (
              agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  type={agent.type}
                  status={agent.isPublic ? "online" : "offline"}
                  selected={selectedAgent?.name === agent.name}
                  onClick={() => updateSelectedAgent(agent, true)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
}