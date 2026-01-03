'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Agent } from '@/types/agent'
import FileUploader from './file-uploader'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Settings, BarChart3, Code, MessageSquare, Users, Clock, Zap, Globe, Edit3, Save, X, Eye, EyeOff, Activity, Trash2, Sparkles, Shield } from 'lucide-react'
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
import { Slider } from "@/components/ui/slider"

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { collection, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/api/firebase/firebaseConfig'
import ContextSheet from '@/components/dashboard/context-sheet'
import { deleteAgent } from '@/app/(ai)/dashboard/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AgentOptionsProps {
  agent: Agent;
  updateSelectedAgent: (agent: Agent | null, isEditing: boolean) => void;
  currentUserId?: string;
  onAgentDeleted?: () => void;
}

function AgentOptions({ agent, updateSelectedAgent, currentUserId, onAgentDeleted }: AgentOptionsProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: agent.name,
    description: agent.description || '',
    type: agent.type,
    personality: agent.personality || 'professional',
    tone: agent.tone || 'neutral',
    expertise: agent.expertise || [],
    contextMemory: agent.contextMemory || 5,
    isPublic: agent.isPublic,
    extendedThinking: (agent as any).extendedThinking || false,
    guardrails: (agent as any).guardrails || '',
    llmConfig: (agent as any).llmConfig || {
      model: 'gemini-3-flash',
      temperature: 0.7,
      maxTokens: 8192
    },
    customSystemPrompt: (agent as any).customSystemPrompt || '',
    extraContext: (agent as any).extraContext || ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

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
      defaultTabREf.current?.scrollIntoView({ behavior: 'smooth' })
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


    const agentDocRef = doc(db, 'agents', agent.id)
    updateDoc(agentDocRef, {
      isPublic: (!agent.isPublic),
    }).then(() => {
      agent.isPublic = !agent.isPublic;
    })

  }
  const handleExit = () => {
    updateSelectedAgent(null, false)
  }
  return (
    <div className="w-full overflow-x-hidden space-y-6 p-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="icon-container p-3 bg-white/10 border border-white/10">
              <MessageSquare className="h-6 w-6 text-white/80" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="capitalize bg-white/10 text-white/70 border-white/10">
                  {agent.type}
                </Badge>
                <Badge
                  variant={agent.isPublic ? "default" : "outline"}
                  className={agent.isPublic
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-white/10 text-white/70 border-white/10"}
                >
                  {agent.isPublic ? <><Globe className="h-3 w-3 mr-1" />Public</> : <><EyeOff className="h-3 w-3 mr-1" />Private</>}
                </Badge>
              </div>
              {agent.description && (
                <p className="text-sm text-muted-foreground mt-3 max-w-xl">{agent.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { togglePublic() }}
              className="flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
            >
              {agent.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {agent.isPublic ? 'Public' : 'Private'}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => { handleExit() }}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-container p-2">
            <BarChart3 className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Analytics</h3>
            <p className="text-sm text-muted-foreground">Performance metrics for your agent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <MessageSquare className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Queries</p>
                <p className="text-xl font-bold text-white number-animate">{(agent.totalQueries || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/20 rounded-xl border border-green-500/30">
                <Zap className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tokens Used</p>
                <p className="text-xl font-bold text-white number-animate">{(agent.tokensUsed || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Activity className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Chats</p>
                <p className="text-xl font-bold text-white number-animate">{(agent.totalChats || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-container p-2">
            <Settings className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Actions</h3>
            <p className="text-sm text-muted-foreground">Manage and interact with your agent</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
              >
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
                        borderRadius: '0.75rem',
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

          <Link href={`/chat/${agent.id}`}>
            <Button className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Use Agent
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => { toggleEditing() }}
            className="flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white"
          >
            <Edit3 className="h-4 w-4" />
            Edit Settings
          </Button>

          {/* Delete Button with Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{agent.name}</strong>? This action cannot be undone. All data associated with this agent will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={async () => {
                    if (!currentUserId) {
                      console.error('No user ID provided');
                      return;
                    }
                    setIsDeleting(true);
                    const result = await deleteAgent(agent.id, currentUserId);
                    if (result.success) {
                      updateSelectedAgent(null, false);
                      onAgentDeleted?.();
                    } else {
                      console.error(result.error);
                      setIsDeleting(false);
                    }
                  }}
                >
                  Delete Agent
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Context Sheet */}
      <div className="max-w-full overflow-x-auto">
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
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

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Extended Thinking
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable deeper reasoning for complex queries
                    </p>
                  </div>
                  <Switch
                    checked={editForm.extendedThinking}
                    onCheckedChange={(checked) => handleInputChange('extendedThinking', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardrails" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Guardrails & Restrictions
                  </Label>
                  <Textarea
                    id="guardrails"
                    value={editForm.guardrails}
                    onChange={(e) => handleInputChange('guardrails', e.target.value)}
                    placeholder="Define safety guidelines and restrictions for your agent..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Set boundaries for what the agent should and shouldn't do
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">LLM Configuration</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Select 
                        value={editForm.llmConfig.model} 
                        onValueChange={(value) => handleInputChange('llmConfig', { ...editForm.llmConfig, model: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-3-pro-preview">
                            <div className="flex items-center gap-2">
                              <span>Gemini 3 Pro Preview</span>
                              <span className="text-xs text-muted-foreground">Most capable</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="gemini-3-flash">
                            <div className="flex items-center gap-2">
                              <span>Gemini 3 Flash</span>
                              <span className="text-xs text-muted-foreground">Fast & powerful</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="gemini-2.5-flash-lite">
                            <div className="flex items-center gap-2">
                              <span>Gemini 2.5 Flash Lite</span>
                              <span className="text-xs text-muted-foreground">Super fast</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        value={editForm.llmConfig.maxTokens}
                        onChange={(e) => handleInputChange('llmConfig', { ...editForm.llmConfig, maxTokens: parseInt(e.target.value) || 8192 })}
                        placeholder="8192"
                        min="100"
                        max="100000"
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum response length
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">
                      Temperature: {editForm.llmConfig.temperature.toFixed(1)}
                    </Label>
                    <Slider
                      value={[editForm.llmConfig.temperature]}
                      onValueChange={(value) => handleInputChange('llmConfig', { ...editForm.llmConfig, temperature: value[0] })}
                      min={0}
                      max={2}
                      step={0.1}
                      className="py-4"
                    />
                    <p className="text-sm text-muted-foreground">
                      Lower = more focused & deterministic. Higher = more creative & varied.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="customSystemPrompt" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Custom System Prompt
                  </Label>
                  <Textarea
                    id="customSystemPrompt"
                    value={editForm.customSystemPrompt}
                    onChange={(e) => handleInputChange('customSystemPrompt', e.target.value)}
                    placeholder="You are a helpful assistant that specializes in..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Override the auto-generated prompt based on your configuration
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extraContext">Extra Context</Label>
                  <Textarea
                    id="extraContext"
                    value={editForm.extraContext}
                    onChange={(e) => handleInputChange('extraContext', e.target.value)}
                    placeholder="Additional context or information for your agent..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide additional background information or instructions
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
                    isPublic: agent.isPublic,
                    extendedThinking: (agent as any).extendedThinking || false,
                    guardrails: (agent as any).guardrails || '',
                    llmConfig: (agent as any).llmConfig || {
                      model: 'gemini-3-flash',
                      temperature: 0.7,
                      maxTokens: 8192
                    },
                    customSystemPrompt: (agent as any).customSystemPrompt || '',
                    extraContext: (agent as any).extraContext || ''
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
