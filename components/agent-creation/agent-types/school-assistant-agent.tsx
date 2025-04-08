import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SchoolAssistantData {
    agentName: string;
    tone: string;
    schoolName: string;
    userTypes: string;
    keyPlatforms?: string;
    academicIntegrityPolicy?: string;
    privacyPolicy?: string;
    supportContacts?: string;
}

interface SchoolAssistantFormProps {
    onSubmit: (data: SchoolAssistantData) => void;
    initialData?: Partial<SchoolAssistantData>;
}

export function SchoolAssistantForm({ onSubmit, initialData = {} }: SchoolAssistantFormProps) {
    const [formData, setFormData] = useState<SchoolAssistantData>({
        agentName: initialData.agentName || 'School Helper',
        tone: initialData.tone || 'helpful, knowledgeable, and encouraging',
        schoolName: initialData.schoolName || '',
        userTypes: initialData.userTypes || 'students, teachers, and staff',
        keyPlatforms: initialData.keyPlatforms || '',
        academicIntegrityPolicy: initialData.academicIntegrityPolicy || 'Standard academic integrity rules apply; do not help users cheat or plagiarize.',
        privacyPolicy: initialData.privacyPolicy || 'Handle personal information with strict confidentiality per school policy.',
        supportContacts: initialData.supportContacts || '',
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
            <h3 className="text-lg font-semibold">School Assistant Agent Details</h3>

            {/* Shared Fields */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="agentName">Agent Name</Label>
                    <Input id="agentName" name="agentName" value={formData.agentName} onChange={handleChange} placeholder="e.g., StudyBot, Campus Helper" required />
                </div>
                 <div>
                    <Label htmlFor="tone">Agent Tone</Label>
                    <Input id="tone" name="tone" value={formData.tone} onChange={handleChange} placeholder="e.g., encouraging, patient, formal" required />
                </div>
            </div>

            {/* Specific Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="e.g., Maplewood High School" required />
                </div>
                 <div>
                    <Label htmlFor="userTypes">User Types Served</Label>
                    <Input id="userTypes" name="userTypes" value={formData.userTypes} onChange={handleChange} placeholder="e.g., students, teachers, staff" required />
                </div>
            </div>

             <div>
                <Label htmlFor="keyPlatforms">Key Platforms/Tools (Optional)</Label>
                <Input id="keyPlatforms" name="keyPlatforms" value={formData.keyPlatforms} onChange={handleChange} placeholder="e.g., Google Classroom, PowerSchool, library.school.edu" />
             </div>
             <div>
                <Label htmlFor="supportContacts">Key Support Contacts (Optional)</Label>
                <Input id="supportContacts" name="supportContacts" value={formData.supportContacts} onChange={handleChange} placeholder="e.g., IT: it@school.edu, Guidance: guidance@school.edu" />
             </div>

             {/* Text Areas */}
            <div>
                <Label htmlFor="academicIntegrityPolicy">Academic Integrity Policy Summary (Optional)</Label>
                <Textarea id="academicIntegrityPolicy" name="academicIntegrityPolicy" value={formData.academicIntegrityPolicy} onChange={handleChange} placeholder="Summarize the school's policy and AI's role..." />
            </div>
            <div>
                <Label htmlFor="privacyPolicy">Privacy Policy Summary (Optional)</Label>
                <Textarea id="privacyPolicy" name="privacyPolicy" value={formData.privacyPolicy} onChange={handleChange} placeholder="Summarize privacy guidelines for the AI..." />
            </div>

            <Button type="submit">Save School Assistant Agent</Button>
        </form>
    );
}