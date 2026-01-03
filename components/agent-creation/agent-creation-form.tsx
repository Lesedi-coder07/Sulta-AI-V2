"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/app/api/firebase/firebaseConfig";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAgentOptions } from "@/components/agent-creation/text-agent-options";
import { BasicAgentConfig } from "@/components/agent-creation/basic-agent-config";
import { arrayUnion, collection, doc, updateDoc, setDoc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import AgentCreatedSuccessfully from "./agent-created-successfully";
import { generateSystemMessage } from "@/app/(ai)/create/generateSystemMessage";
import ExtraContextField from "./extra-context-field";
import { GuardrailsConfig } from "./guardrails-config";
import { TechnicalConfig } from "./technical-config";

const agentFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  type: z.enum(["text", "customer-support", "school-assistant", "employee-onboarding"]),
  isPublic: z.boolean().default(false),
  
  // Text agent configuration
  textConfig: z.object({
    personality: z.enum(["professional", "friendly", "creative", "technical"]),
    tone: z.enum(["formal", "casual", "enthusiastic", "neutral"]),
    expertise: z.string().optional(),
    contextMemory: z.number().min(1).max(10),
    extendedThinking: z.boolean().default(false),
  }).optional(),

  // Customer support agent configuration
  customerSupportConfig: z.object({
    agentName: z.string(),
    tone: z.string(),
    companyName: z.string(),
    serviceType: z.string(),
    keyFeatures: z.string(),
    companyWebsite: z.string(),
    otherSupportChannels: z.string(),
    operatingHours: z.string(),
    refundPolicySummary: z.string().optional(),
    privacyPolicySummary: z.string().optional(),
    tosSummary: z.string().optional(),
    currentPromotionsOrIssues: z.string().optional(),
    accountPageLink: z.string().optional(),
    specializedTeamContact: z.string().optional(),
    complaintProcedure: z.string().optional(),
    escalationProcess: z.string().optional(),
    commonRequests: z.string().optional(),
  }).optional(),

  // School assistant agent configuration
  schoolAssistantConfig: z.object({
    agentName: z.string(),
    tone: z.string(),
    schoolName: z.string(),
    userTypes: z.string(),
    keyPlatforms: z.string().optional(),
    academicIntegrityPolicy: z.string().optional(),
    privacyPolicy: z.string().optional(),
    supportContacts: z.string().optional(),
  }).optional(),

  // Employee onboarding agent configuration
  employeeOnboardingConfig: z.object({
    agentName: z.string(),
    tone: z.string(),
    companyName: z.string(),
    companyCultureSummary: z.string().optional(),
    keyPolicies: z.string().optional(),
    benefitsOverview: z.string().optional(),
    requiredTools: z.string().optional(),
    firstWeekTasks: z.string().optional(),
    keyContacts: z.string().optional(),
    hrHelpdeskContact: z.string().optional(),
    itHelpdeskContact: z.string().optional(),
  }).optional(),

  extraContext: z.string().default(''),

  // Guardrails & Restrictions
  guardrails: z.string().optional(),

  // LLM Configuration
  llmConfig: z.object({
    model: z.string().default('gemini-3-flash'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(100).max(100000).default(8192),
  }).optional(),

  // Custom API Tool (Experimental)
  customApiTool: z.object({
    url: z.string().url().optional().or(z.literal('')),
    responseSchema: z.string().optional(),
    parameters: z.string().optional(),
  }).optional(),

  // Custom System Prompt
  customSystemPrompt: z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export function AgentCreationForm() {
  const [agentType, setAgentType] = useState<"text" | "customer-support" | "school-assistant" | "employee-onboarding">("text");
  const [showLink, setShowLink] = useState<false | true>(false);
  const [agentLink, setAgentLink] = useState<string | null>(null);
  const [AgentCreated, setAgentCreated] = useState<false | true>(false);
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
        expertise: '',
        contextMemory: 5,
        extendedThinking: false,
      },
      customerSupportConfig: {
        agentName: '',
        tone: 'helpful, empathetic, and professional',
        companyName: '',
        serviceType: '',
        keyFeatures: '',
        companyWebsite: '',
        otherSupportChannels: '',
        operatingHours: '',
      },
      schoolAssistantConfig: {
        agentName: 'School Helper',
        tone: 'helpful, knowledgeable, and encouraging',
        schoolName: '',
        userTypes: 'students, teachers, and staff',
      },
      employeeOnboardingConfig: {
        agentName: 'Onboarding Buddy',
        tone: 'welcoming, helpful, and informative',
        companyName: '',
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

      // Generate system message using text agent config
      const systemMessage = generateSystemMessage(
        data.name, 
        data.description, 
        data.type,
        data.textConfig?.personality,
        data.textConfig?.tone, 
        data.textConfig?.expertise,
        data.extraContext,
        data.guardrails,
        data.customSystemPrompt
      );

      // Helper function to remove undefined values from objects (Firebase doesn't allow undefined)
      const removeUndefined = (obj: any): any => {
        if (obj === null || obj === undefined) return undefined;
        if (typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(removeUndefined).filter(v => v !== undefined);
        
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          const cleanedValue = removeUndefined(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
      };

      const agentData = removeUndefined({
        ...data,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        systemMessage,
      });

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
          createdAt: new Date().toISOString(),
          queries: 0,
          userCount: 0,
        });
      }

      
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
        onValueChange={(value) => setAgentType(value as "text" | "customer-support" | "school-assistant" | "employee-onboarding")}
      >
        <TabsList className="hidden w-full overflow-x-auto sm:grid sm:grid-cols-1 items-center justify-start sm:justify-center bg-card border border-border gap-2 sm:gap-0 p-1">
          {/* <TabsTrigger value="text" className="flex-shrink-0 space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
            <Bot className="h-4 w-4" />
            <span>New Agent</span>
          </TabsTrigger> */}
          {/* Temporarily hidden while refining */}
          {/* <TabsTrigger value="customer-support" className="flex-shrink-0 space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
            <MessageCircle className="h-4 w-4" />
            <span>Support</span>
          </TabsTrigger>
          <TabsTrigger value="school-assistant" className="flex-shrink-0 space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
            <GraduationCap className="h-4 w-4" />
            <span>School</span>
          </TabsTrigger>
          <TabsTrigger value="employee-onboarding" className="flex-shrink-0 space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
            <Users className="h-4 w-4" />
            <span>Onboarding</span>
          </TabsTrigger> */}
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicAgentConfig form={form} className="mt-8" />
            
            {/* Hidden field to track the current agent type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }: any) => (
                <input type="hidden" {...field} value={agentType} />
              )}
            />

            <TabsContent value="text" className="space-y-8">
              <TextAgentOptions form={form} />
              <GuardrailsConfig form={form} />
              <TechnicalConfig form={form} />
              <ExtraContextField form={form} />
            </TabsContent>

            {/* Temporarily hidden while refining */}
            {/* <TabsContent value="customer-support" className="space-y-8">
              <CustomerSupportConfig form={form} />
              <ExtraContextField form={form} />
            </TabsContent>

            <TabsContent value="school-assistant" className="space-y-8">
              <SchoolAssistantConfig form={form} />
              <ExtraContextField form={form} />
            </TabsContent>

            <TabsContent value="employee-onboarding" className="space-y-8">
              <EmployeeOnboardingConfig form={form} />
              <ExtraContextField form={form} />
            </TabsContent> */}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" className="border-border hover:bg-accent">
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {form.formState.isSubmitting ? "Creating..." : "Create Agent"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>)
  );
}