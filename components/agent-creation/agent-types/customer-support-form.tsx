import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Define the shape of the data this form collects
interface CustomerSupportData {
    agentName: string;
    tone: string; // Corresponds to companyBrandVoice
    companyName: string;
    serviceType: string;
    keyFeatures: string;
    companyWebsite: string;
    otherSupportChannels: string;
    operatingHours: string;
    refundPolicySummary?: string;
    privacyPolicySummary?: string;
    tosSummary?: string;
    currentPromotionsOrIssues?: string;
    accountPageLink?: string;
    specializedTeamContact?: string;
    complaintProcedure?: string;
    escalationProcess?: string;
    commonRequests?: string;
}

interface CustomerSupportFormProps {
    // Callback function to pass the collected data up
    onSubmit: (data: CustomerSupportData) => void;
    initialData?: Partial<CustomerSupportData>; // For pre-filling form
}

export function CustomerSupportForm({ onSubmit, initialData = {} }: CustomerSupportFormProps) {
    const [formData, setFormData] = useState<CustomerSupportData>({
        agentName: initialData.agentName || '',
        tone: initialData.tone || 'helpful, empathetic, and professional',
        companyName: initialData.companyName || '',
        serviceType: initialData.serviceType || '',
        keyFeatures: initialData.keyFeatures || '',
        companyWebsite: initialData.companyWebsite || '',
        otherSupportChannels: initialData.otherSupportChannels || '',
        operatingHours: initialData.operatingHours || '',
        refundPolicySummary: initialData.refundPolicySummary || '',
        privacyPolicySummary: initialData.privacyPolicySummary || '',
        tosSummary: initialData.tosSummary || '',
        currentPromotionsOrIssues: initialData.currentPromotionsOrIssues || '',
        accountPageLink: initialData.accountPageLink || '',
        specializedTeamContact: initialData.specializedTeamContact || '',
        complaintProcedure: initialData.complaintProcedure || '',
        escalationProcess: initialData.escalationProcess || '',
        commonRequests: initialData.commonRequests || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData); // Pass data to parent component
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold">Customer Support Agent Details</h3>

            {/* Shared Fields (Could be moved outside if needed) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="agentName">Agent Name</Label>
                    <Input id="agentName" name="agentName" value={formData.agentName} onChange={handleChange} placeholder="e.g., SupportBot" required />
                </div>
                 <div>
                    <Label htmlFor="tone">Agent Tone / Brand Voice</Label>
                    <Input id="tone" name="tone" value={formData.tone} onChange={handleChange} placeholder="e.g., empathetic, professional" required />
                </div>
            </div>

            {/* Specific Fields */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your Company Inc." required />
                </div>
                 <div>
                    <Label htmlFor="serviceType">Service/Product Type</Label>
                    <Input id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} placeholder="e.g., Cloud Hosting, SaaS Platform" required />
                </div>
             </div>

            <div>
                <Label htmlFor="keyFeatures">Key Features/Benefits</Label>
                <Textarea id="keyFeatures" name="keyFeatures" value={formData.keyFeatures} onChange={handleChange} placeholder="Comma-separated list of key features" required />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input id="companyWebsite" name="companyWebsite" type="url" value={formData.companyWebsite} onChange={handleChange} placeholder="https://example.com" required />
                </div>
                 <div>
                    <Label htmlFor="otherSupportChannels">Other Support Channels</Label>
                    <Input id="otherSupportChannels" name="otherSupportChannels" value={formData.otherSupportChannels} onChange={handleChange} placeholder="e.g., support@example.com, 1-800-..." required />
                </div>
                <div>
                    <Label htmlFor="operatingHours">Support Operating Hours</Label>
                    <Input id="operatingHours" name="operatingHours" value={formData.operatingHours} onChange={handleChange} placeholder="e.g., 9 AM - 5 PM EST, Mon-Fri" required/>
                </div>
                <div>
                     <Label htmlFor="accountPageLink">Account Page Link (Optional)</Label>
                     <Input id="accountPageLink" name="accountPageLink" type="url" value={formData.accountPageLink} onChange={handleChange} placeholder="https://app.example.com/account" />
                 </div>
                 <div>
                     <Label htmlFor="specializedTeamContact">Specialized Team Contact (Optional)</Label>
                     <Input id="specializedTeamContact" name="specializedTeamContact" value={formData.specializedTeamContact} onChange={handleChange} placeholder="e.g., billing@example.com for billing issues" />
                 </div>
                 <div>
                     <Label htmlFor="commonRequests">Common Requests AI Can Handle (Optional)</Label>
                     <Input id="commonRequests" name="commonRequests" value={formData.commonRequests} onChange={handleChange} placeholder="e.g., password resets, basic feature questions" />
                 </div>
            </div>

            {/* Optional Text Areas */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                     <Label htmlFor="refundPolicySummary">Refund Policy Summary (Optional)</Label>
                     <Textarea id="refundPolicySummary" name="refundPolicySummary" value={formData.refundPolicySummary} onChange={handleChange} placeholder="Briefly summarize your refund policy..." />
                 </div>
                 <div>
                     <Label htmlFor="privacyPolicySummary">Privacy Policy Summary (Optional)</Label>
                     <Textarea id="privacyPolicySummary" name="privacyPolicySummary" value={formData.privacyPolicySummary} onChange={handleChange} placeholder="Briefly summarize your privacy policy..." />
                 </div>
                 <div>
                     <Label htmlFor="tosSummary">Terms of Service Summary (Optional)</Label>
                     <Textarea id="tosSummary" name="tosSummary" value={formData.tosSummary} onChange={handleChange} placeholder="Briefly summarize your ToS..." />
                 </div>
                <div>
                    <Label htmlFor="currentPromotionsOrIssues">Current Promotions/Known Issues (Optional)</Label>
                    <Textarea id="currentPromotionsOrIssues" name="currentPromotionsOrIssues" value={formData.currentPromotionsOrIssues} onChange={handleChange} placeholder="e.g., 10% off annual plans, login issues under investigation" />
                </div>
                 <div>
                     <Label htmlFor="complaintProcedure">Complaint Procedure (Optional)</Label>
                     <Textarea id="complaintProcedure" name="complaintProcedure" value={formData.complaintProcedure} onChange={handleChange} placeholder="How the AI should handle complaints..." />
                 </div>
                 <div>
                     <Label htmlFor="escalationProcess">Escalation Process (Optional)</Label>
                     <Textarea id="escalationProcess" name="escalationProcess" value={formData.escalationProcess} onChange={handleChange} placeholder="When and how to escalate to a human..." />
                 </div>
            </div>


            <Button type="submit">Save Customer Support Agent</Button>
        </form>
    );
}