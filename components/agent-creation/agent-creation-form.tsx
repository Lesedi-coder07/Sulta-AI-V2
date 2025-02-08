"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/app/api/firebase/firebaseConfig";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bot, Wand2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAgentOptions } from "@/components/agent-creation/text-agent-options";
import { CallAgentOptions } from "@/components/agent-creation/call-agent-options";
import { BasicAgentConfig } from "@/components/agent-creation/basic-agent-config";
import { arrayUnion, collection, doc, updateDoc, setDoc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import AgentCreatedSuccessfully from "./agent-created-successfully";
import { generateSystemMessage } from "@/app/ai/create/generateSystemMessage";
import ExtraContextField from "./extra-context-field";

const agentFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  type: z.enum(["text", "voice"]),
  isPublic: z.boolean().default(false),
  // Type-specific configurations will be added dynamically
  textConfig: z.object({
    personality: z.enum(["professional", "friendly", "creative", "technical"]),
    tone: z.enum(["formal", "casual", "enthusiastic", "neutral"]),
    expertise: z.array(z.string()).min(1),
    contextMemory: z.number().min(1).max(10),
  }).optional(),

  // Content agent options
  voiceConfig: z.object({
   
    voice: z.enum(["nat", "james", "sarah", "emily"]),
    language: z.enum(["en", "es", "fr", "de"]),
  }).optional(),

  extraContext: z.string().default(''),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export function AgentCreationForm() {
  const [agentType, setAgentType] = useState<"text" | "voice">("text");
  const [showLink, setShowLink] = useState<false | true>(false);
  const [agentLink, setAgentLink] = useState<string | null>(null);
  const [AgentCreated, setAgentCreated] = useState<false | true>(true);
  const  user  = auth.currentUser;

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      type: "text",
      name: '',
      description: '',
      textConfig: {
        personality: "professional",
        tone: "formal",
        expertise: [],
        contextMemory: 5,
      },
      voiceConfig: {
        voice: "nat",
        language: "en",
      },
      extraContext: '',
    },
  });

  const toggleAgentCreated = () => {
    setAgentCreated(!AgentCreated)
  }

  async function onSubmit(data: AgentFormValues) {
    try {
      if (!user?.uid) {
        console.error('No user is logged in');
        return;
      }

      const agentData = {
        ...data,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        systemMessage: data.type === "text" ? 
          generateSystemMessage(
            data.name, 
            data.description, 
            data.type,
            data.textConfig?.personality,
            data.textConfig?.tone, 
            data.textConfig?.expertise
          ) :
          `You are a call center agent named ${data.name}. You are a ${data.type}. Your description is ${data.description}.`
      };

      // Create the agent document
      const agentRef = await addDoc(collection(db, "agents"), agentData);

      // Get reference to user document
      const userRef = doc(db, "users", user.uid);
      
      try {
        // Try to update existing user document
        await updateDoc(userRef, {
          agents: arrayUnion(agentRef.id)
        });
      } catch (error) {
        // If user document doesn't exist, create it
        await setDoc(userRef, {
          agents: [agentRef.id],
          ownerID: user.uid,
          createdAt: new Date().toISOString()
        });
      }

      console.log('Agent created successfully with ID:', agentRef.id);
      setAgentLink(agentRef.id as string)
      setShowLink(true)
      toggleAgentCreated()
      
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  }

  return ( AgentCreated ? (<AgentCreatedSuccessfully setAgentCreated={toggleAgentCreated} url={agentLink} name={form.getValues('name')} />) : (
    <div className="mt-8 space-y-8">
      <Tabs
        defaultValue="text"
        className="w-full"
        onValueChange={(value) => setAgentType(value as "text" | "voice")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="space-x-2">
            <Bot className="h-4 w-4" />
            <span>Text AI</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>Voice AI</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicAgentConfig form={form} className="mt-8" />

            <TabsContent value="text" className="space-y-8">
              <TextAgentOptions form={form} />
              <ExtraContextField form={form} />
            </TabsContent>

            <TabsContent value="voice" className="space-y-8">
              <CallAgentOptions form={form} />
              <ExtraContextField form={form} /> 
            </TabsContent>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Agent"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>)
  );
}