'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Agent } from '@/types/agent'
import FileUploader from './file-uploader'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Settings, BarChart3, Code, MessageSquare, Users, Clock, Zap, Globe, Edit3, Save, X, Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { collection, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/api/firebase/firebaseConfig'
import ContextSheet from '@/components/dashboard/context-sheet'

interface AgentOptionsProps {
  agent: Agent;
  updateSelectedAgent: (agent: Agent | null, isEditing: boolean) => void;
}

function AgentOptions ({agent, updateSelectedAgent}: AgentOptionsProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: agent.name,
    description: agent.description || '',
    type: agent.type,
    personality: agent.personality || 'professional',
    tone: agent.tone || 'neutral',
    expertise: agent.expertise || [],
    contextMemory: agent.contextMemory || 5,
    isPublic: agent.isPublic
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!editForm.name.trim()) {
      errors.name = 'Agent name is required';
    } else if (editForm.name.length < 2) {
      errors.name = 'Agent name must be at least 2 characters';
    } else if (editForm.name.length > 50) {
      errors.name = 'Agent name must be less than 50 characters';
    }
    
    if (editForm.description && editForm.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    if (editForm.contextMemory < 1 || editForm.contextMemory > 10) {
      errors.contextMemory = 'Context memory must be between 1 and 10';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const agentDocRef = doc(db, 'agents', agent.id);
      await updateDoc(agentDocRef, editForm);
      
      // Update local agent object
      Object.assign(agent, editForm);
      
      setEditing(false);
      setFormErrors({});
    } catch (error) {
      console.error('Error updating agent:', error);
      setFormErrors({ general: 'Failed to save changes. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }



  const editTabRef = useRef<HTMLDivElement>(null);
  const defaultTabREf = useRef<HTMLDivElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    if (editing) {
      editTabRef.current?.focus();
      editTabRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      defaultTabREf.current?.scrollIntoView( {behavior: 'smooth'})
    }
  }, [editing]);
 const createEmbedCode = () => {
  return ` <script src="https://ai.sultatech.com/cdn/agent-widget.js"></script>
    <script>
        initAIWidget({
            agentId: "${agent.id}",
            position: "bottom-right",
            primaryColor: "#3254f4"
        });

    </script>`
 }
  const togglePublic = async () => {
    

    const agentDocRef = doc(db,'agents', agent.id)
    updateDoc(agentDocRef, {
      isPublic: (!agent.isPublic),
    }).then(() => {
      agent.isPublic = !agent.isPublic;
    })
  
   } 
   const handleExit = () => {
    updateSelectedAgent(null, false )
   }
  return (
    <div className="w-full overflow-x-hidden space-y-6">
      <div className="space-y-6 p-4">
        {/* Header Section */}
        <Card ref={defaultTabREf}>
          <CardHeader className="pb-4">
            <div className="flex flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
          <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{agent.name}</h2>
                    <div className="flex items-center gap-2"><br /><br />
                      <Badge variant="secondary" className="capitalize">{agent.type}</Badge>
                      <Badge variant={agent.isPublic ? "default" : "outline"}>
                        {agent.isPublic ? <><Globe className="h-3 w-3 mr-1" />Public</> : <><EyeOff className="h-3 w-3 mr-1" />Private</>}
                      </Badge>
                    </div>
                  </div>
                </div>
                {agent.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{agent.description}</p>
                )}
          </div>
          
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {togglePublic()}}
                  className="flex items-center gap-2"
                >
                  {agent.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {agent.isPublic ? 'Public' : 'Private'}
                </Button>

                <Button 
                  variant="ghost"
                  size="sm"
              onClick={() => {handleExit()}}
                  className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <X className="h-4 w-4" />
                </Button>
          </div>
        </div>
          </CardHeader>
        </Card>

        {/* Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>Performance metrics for your agent</CardDescription>
          </CardHeader>
          <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Queries</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">0</p>
          </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
          </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Tokens Used</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">0</p>
          </div>
        </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Response Time</h3>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">0ms</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deploy Modal */}
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Deploy</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] lg:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Deploy Agent to your website</DialogTitle>
              <DialogDescription>
                Copy and paste this code to embed your agent on any website.
              </DialogDescription>
            </DialogHeader>


            <div className="grid gap-4 py-4">
             <div className="grid gap-2">
  <Label htmlFor="embed">Embed Code</Label>
  <div className="relative">
    <SyntaxHighlighter
      language="javascript"
      style={vs2015}
      customStyle={{
        padding: '1rem',
        borderRadius: '0.375rem',
        height: '200px',
        width: '700px',
        overflow: 'auto',
        fontSize: '11px'
      }}
    >
      {createEmbedCode()}
    </SyntaxHighlighter>
    {/* <Button
      className="absolute top-2 right-2"
      variant="secondary"
      size="sm"
      onClick={() => navigator.clipboard.writeText(createEmbedCode())}
    >
      Copy
    </Button> 
  </div>
</div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => {
                navigator.clipboard.writeText(createEmbedCode());
              }}>
                Copy Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Actions
            </CardTitle>
            <CardDescription>Manage and interact with your agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
             <Dialog>
          <DialogTrigger asChild>
                  <Button variant="default" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Deploy
                  </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] lg:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Deploy Agent to your website</DialogTitle>
              <DialogDescription>
                Copy and paste this code to embed your agent on any website.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
             <div className="grid gap-2">
  <Label htmlFor="embed">Embed Code</Label>
  <div className="relative">
    <SyntaxHighlighter
      language="javascript"
      style={vs2015}
      customStyle={{
        padding: '1rem',
        borderRadius: '0.375rem',
        height: '200px',
                            width: '100%',
        overflow: 'auto',
        fontSize: '11px'
      }}
    >
      {createEmbedCode()}
    </SyntaxHighlighter>
  </div>
</div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => {
                navigator.clipboard.writeText(createEmbedCode());
              }}>
                Copy Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    
          <Link href={`/ai/chat/${agent.id}`}>
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Use Agent
                  <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Button 
            variant="outline"
            onClick={() => {toggleEditing()}}
                className="flex items-center gap-2"
          >
                <Edit3 className="h-4 w-4" />
                Edit Settings
          </Button>
        </div>
          </CardContent>
        </Card>
      </div>
      <div className="max-w-full overflow-x-auto">
        {/* <FileUploader /> */}
        <ContextSheet />
      </div>

      {/* Comprehensive Edit Form */}
      <div ref={editTabRef} className={editing ? 'block' : 'hidden'}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit Agent Settings
            </CardTitle>
            <CardDescription>Customize your agent's behavior and appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="My AI Assistant"
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Agent Type</Label>
                    <Select value={editForm.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Agent</SelectItem>
                        <SelectItem value="customer-support">Customer Support</SelectItem>
                        <SelectItem value="school-assistant">School Assistant</SelectItem>
                        <SelectItem value="employee-onboarding">Employee Onboarding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what your AI agent does..."
                    rows={3}
                    className={formErrors.description ? 'border-red-500' : ''}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-500">{formErrors.description}</p>
                  )}
          </div>
          
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Public Agent</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this agent available to other users
                    </p>
                  </div>
                  <Switch
                    checked={editForm.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="personality" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personality">Personality</Label>
                    <Select value={editForm.personality} onValueChange={(value) => handleInputChange('personality', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={editForm.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Input
                    id="expertise"
                    value={Array.isArray(editForm.expertise) ? editForm.expertise.join(', ') : editForm.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    placeholder="e.g., Customer Service, Technical Support, Sales"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple areas with commas
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="contextMemory">Context Memory (1-10)</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={editForm.contextMemory}
                      onChange={(e) => handleInputChange('contextMemory', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8">{editForm.contextMemory}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How many previous messages the agent remembers in conversations
                  </p>
          </div>

                <Separator />
                
                <div className="space-y-2">
                  <Label>Agent Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString()}
                    </span>
          </div>
        </div>
              </TabsContent>
            </Tabs>
            
            {formErrors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{formErrors.general}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditing(false);
                  setFormErrors({});
                  // Reset form to original values
                  setEditForm({
                    name: agent.name,
                    description: agent.description || '',
                    type: agent.type,
                    personality: agent.personality || 'professional',
                    tone: agent.tone || 'neutral',
                    expertise: agent.expertise || [],
                    contextMemory: agent.contextMemory || 5,
                    isPublic: agent.isPublic
                  });
                }}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AgentOptions 
