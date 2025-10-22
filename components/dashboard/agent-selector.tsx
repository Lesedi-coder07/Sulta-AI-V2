"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "./agent-card";
import { auth } from "@/app/api/firebase/firebaseConfig";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/api/firebase/firebaseConfig";
import { log } from "console";
import AgentOptions from "./agent-options";
import { useRouter } from "next/navigation";

const agents1 = [
  {
    id: "1",
    name: "Writing Assistant",
    type: "Content" as const,
    status: "online" as const,
  },
  {
    id: "2",
    name: "Melody Maker",
    type: "Music" as const,
    status: "online" as const,
  },
  {
    id: "3",
    name: "Text Analyzer",
    type: "Text" as const,
    status: "busy" as const,
  },
  {
    id: "4",
    name: "Blog Writer",
    type: "Content" as const,
    status: "offline" as const,
  },
];

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  isPublic: boolean;
}

export function AgentSelector() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentTabOpen, setAgentTabOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateSelectedAgent = (agent: Agent | null, agentTabOpen: boolean) => {
    setSelectedAgent(agent);
    setAgentTabOpen(agentTabOpen);
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
            setIsLoading(false);
            return;
          }

          try {
            const agentPromises = agentIds.map((agentId) => {
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

            // Once initial agents are fetched, set loading to false
            setIsLoading(false);

            // Cleanup all agent listeners on unmount or when agents change
            return () => {
              agentPromises.forEach((unsubscribe) => unsubscribe());
            };
          } catch (error) {
            console.error("Error fetching agents:", error);
            setAgents([]);
            setIsLoading(false);
          }
        });

        return () => {
          unsubscribeUser();
        };
      } else {
        setAgents([]);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const router = useRouter()

const handlePublicAgentClick = (url : string) => {
  
  router.push(url)
}

  return (
    agentTabOpen ? <AgentOptions updateSelectedAgent={updateSelectedAgent} agent={selectedAgent as Agent} /> : (
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

          <div className={`flex flex-row flex-wrap gap-4 w-full ${!isLoading ? 'overflow-y-auto' : ''}`}>
            {isLoading ? (
              <div className="flex flex-col mx-auto justify-center items-center w-full py-12">
                <div className="relative">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700 animate-pulse"></div>
                  
                  {/* Main spinning ring */}
                  <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
                  
                  {/* Inner gradient ring */}
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 border-l-purple-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                  
                  {/* Center dot */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                </div>
                
                {/* Loading text with animation */}
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 animate-pulse">
                    Loading your AI agents...
                  </p>
                  <div className="flex justify-center mt-2 space-x-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            ) : agents.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">You don't have any agents yet</p>
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