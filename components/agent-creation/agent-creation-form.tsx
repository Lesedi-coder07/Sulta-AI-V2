"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/app/api/firebase/firebaseConfig";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bot, MessageCircle, GraduationCap, Users } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAgentOptions } from "@/components/agent-creation/text-agent-options";
import { BasicAgentConfig } from "@/components/agent-creation/basic-agent-config";
import { CustomerSupportConfig } from "@/components/agent-creation/agent-types/customer-support-config";
import { SchoolAssistantConfig } from "@/components/agent-creation/agent-types/school-assistant-config";
import { EmployeeOnboardingConfig } from "@/components/agent-creation/agent-types/employee-onboarding-config";
import { arrayUnion, collection, doc, updateDoc, setDoc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import AgentCreatedSuccessfully from "./agent-created-successfully";
import { generateSystemMessage, generateCustomerSupportSystemPrompt, generateSchoolAssistantSystemPrompt, generateEmployeeOnboardingSystemPrompt } from "@/app/ai/create/generateSystemMessage";
import ExtraContextField from "./extra-context-field";

const agentFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  type: z.enum(["text", "customer-support", "school-assistant", "employee-onboarding"]),
  isPublic: z.boolean().default(false),
  
  // Text agent configuration
  textConfig: z.object({
    personality: z.enum(["professional", "friendly", "creative", "technical"]),
    tone: z.enum(["formal", "casual", "enthusiastic", "neutral"]),
    expertise: z.array(z.string()).min(1),
    contextMemory: z.number().min(1).max(10),
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
        expertise: [],
        contextMemory: 5,
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

      let systemMessage = '';
      
      switch (data.type) {
        case 'text':
          systemMessage = generateSystemMessage(
            data.name, 
            data.description, 
            data.type,
            data.textConfig?.personality,
            data.textConfig?.tone, 
            data.textConfig?.expertise,
            data.extraContext
          );
          break;
        case 'customer-support':
          if (data.customerSupportConfig) {
            systemMessage = generateCustomerSupportSystemPrompt(
              data.customerSupportConfig.companyName,
              data.customerSupportConfig.serviceType,
              data.customerSupportConfig.keyFeatures,
              data.customerSupportConfig.companyWebsite,
              data.customerSupportConfig.otherSupportChannels,
              data.customerSupportConfig.operatingHours,
              data.customerSupportConfig.refundPolicySummary,
              data.customerSupportConfig.privacyPolicySummary,
              data.customerSupportConfig.tosSummary,
              data.customerSupportConfig.currentPromotionsOrIssues,
              data.customerSupportConfig.accountPageLink,
              data.customerSupportConfig.specializedTeamContact,
              data.customerSupportConfig.complaintProcedure,
              data.customerSupportConfig.escalationProcess,
              data.customerSupportConfig.commonRequests,
              data.customerSupportConfig.tone
            );
          }
          break;
        case 'school-assistant':
          if (data.schoolAssistantConfig) {
            systemMessage = generateSchoolAssistantSystemPrompt(
              data.schoolAssistantConfig.agentName,
              data.schoolAssistantConfig.schoolName,
              data.schoolAssistantConfig.userTypes,
              data.schoolAssistantConfig.keyPlatforms,
              data.schoolAssistantConfig.academicIntegrityPolicy,
              data.schoolAssistantConfig.privacyPolicy,
              data.schoolAssistantConfig.supportContacts,
              data.schoolAssistantConfig.tone
            );
          }
          break;
        case 'employee-onboarding':
          if (data.employeeOnboardingConfig) {
            systemMessage = generateEmployeeOnboardingSystemPrompt(
              data.employeeOnboardingConfig.agentName,
              data.employeeOnboardingConfig.companyName,
              data.employeeOnboardingConfig.companyCultureSummary,
              data.employeeOnboardingConfig.keyPolicies,
              data.employeeOnboardingConfig.benefitsOverview,
              data.employeeOnboardingConfig.requiredTools,
              data.employeeOnboardingConfig.firstWeekTasks,
              data.employeeOnboardingConfig.keyContacts,
              data.employeeOnboardingConfig.hrHelpdeskContact,
              data.employeeOnboardingConfig.itHelpdeskContact,
              data.employeeOnboardingConfig.tone
            );
          }
          break;
        default:
          systemMessage = `You are an AI agent named ${data.name}. Your description is ${data.description}. You never mention that you're an LLM trained by Google. `;
      }

      const agentData = {
        ...data,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        systemMessage,
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
        <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-1 items-center justify-start sm:justify-center bg-card border border-border gap-2 sm:gap-0 p-1">
          <TabsTrigger value="text" className="flex-shrink-0 space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
            <Bot className="h-4 w-4" />
            <span>New Agent</span>
          </TabsTrigger>
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