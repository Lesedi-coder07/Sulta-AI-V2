import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EmployeeOnboardingData {
    agentName: string;
    tone: string;
    companyName: string;
    companyCultureSummary?: string;
    keyPolicies?: string;
    benefitsOverview?: string;
    requiredTools?: string;
    firstWeekTasks?: string;
    keyContacts?: string;
    hrHelpdeskContact?: string;
    itHelpdeskContact?: string;
}

interface EmployeeOnboardingFormProps {
    onSubmit: (data: EmployeeOnboardingData) => void;
    initialData?: Partial<EmployeeOnboardingData>;
}

export function EmployeeOnboardingForm({ onSubmit, initialData = {} }: EmployeeOnboardingFormProps) {
    const [formData, setFormData] = useState<EmployeeOnboardingData>({
        agentName: initialData.agentName || 'Onboarding Buddy',
        tone: initialData.tone || 'welcoming, helpful, and informative',
        companyName: initialData.companyName || '',
        companyCultureSummary: initialData.companyCultureSummary || 'a collaborative and innovative environment',
        keyPolicies: initialData.keyPolicies || '',
        benefitsOverview: initialData.benefitsOverview || '',
        requiredTools: initialData.requiredTools || '',
        firstWeekTasks: initialData.firstWeekTasks || 'setting up accounts, introductory meetings, required training modules',
        keyContacts: initialData.keyContacts || '',
        hrHelpdeskContact: initialData.hrHelpdeskContact || '',
        itHelpdeskContact: initialData.itHelpdeskContact || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold">Employee Onboarding Agent Details</h3>

             {/* Shared Fields */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="agentName">Agent Name</Label>
                    <Input id="agentName" name="agentName" value={formData.agentName} onChange={handleChange} placeholder="e.g., Onboarding Buddy, WelcomeBot" required />
                </div>
                 <div>
                    <Label htmlFor="tone">Agent Tone</Label>
                    <Input id="tone" name="tone" value={formData.tone} onChange={handleChange} placeholder="e.g., welcoming, informative, professional" required />
                </div>
            </div>

            {/* Specific Fields */}
             <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your Company Inc." required />
            </div>

             <div>
                <Label htmlFor="companyCultureSummary">Company Culture Summary (Optional)</Label>
                <Textarea id="companyCultureSummary" name="companyCultureSummary" value={formData.companyCultureSummary} onChange={handleChange} placeholder="Briefly describe the company culture..." />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="keyPolicies">Key Policies Info (Optional)</Label>
                    <Input id="keyPolicies" name="keyPolicies" value={formData.keyPolicies} onChange={handleChange} placeholder="e.g., Link to Code of Conduct, IT Policy location" />
                 </div>
                <div>
                    <Label htmlFor="benefitsOverview">Benefits Overview Info (Optional)</Label>
                    <Input id="benefitsOverview" name="benefitsOverview" value={formData.benefitsOverview} onChange={handleChange} placeholder="e.g., Link to Benefits Portal, enrollment deadline" />
                 </div>
                <div>
                    <Label htmlFor="requiredTools">Required Tools (Optional)</Label>
                    <Input id="requiredTools" name="requiredTools" value={formData.requiredTools} onChange={handleChange} placeholder="e.g., Slack, Jira, Google Workspace" />
                 </div>
                <div>
                    <Label htmlFor="firstWeekTasks">Typical First Week Tasks (Optional)</Label>
                    <Input id="firstWeekTasks" name="firstWeekTasks" value={formData.firstWeekTasks} onChange={handleChange} placeholder="e.g., Setup accounts, meet team, training" />
                 </div>
                 <div>
                    <Label htmlFor="keyContacts">Key Contacts Info (Optional)</Label>
                    <Input id="keyContacts" name="keyContacts" value={formData.keyContacts} onChange={handleChange} placeholder="e.g., Your manager, buddy, HR rep" />
                 </div>
                 <div>
                    <Label htmlFor="hrHelpdeskContact">HR Helpdesk Contact Info (Optional)</Label>
                    <Input id="hrHelpdeskContact" name="hrHelpdeskContact" value={formData.hrHelpdeskContact} onChange={handleChange} placeholder="e.g., hr@example.com or HR Portal" />
                 </div>
                 <div>
                    <Label htmlFor="itHelpdeskContact">IT Helpdesk Contact Info (Optional)</Label>
                    <Input id="itHelpdeskContact" name="itHelpdeskContact" value={formData.itHelpdeskContact} onChange={handleChange} placeholder="e.g., it@example.com or Ticketing System" />
                 </div>
            </div>

            <Button type="submit">Save Onboarding Agent</Button>
        </form>
    );
}