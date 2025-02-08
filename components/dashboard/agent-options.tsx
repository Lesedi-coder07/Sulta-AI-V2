'use client'
import React, { useState , useRef, useEffect} from 'react'
import { Agent } from '@/types/agent'
import FileUploader from './file-uploader'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
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

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { collection, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/api/firebase/firebaseConfig'




function AgentOptions ({agent}: {agent: Agent}) {
  const [editing, setEditing] = useState<boolean>(false);
 

  const toggleEditing = () => {
    console.log('toggleEditing')
    setEditing(!editing)
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

  return (
    <div className="w-full overflow-x-hidden space-y-4">
      <div className="space-y-6 p-2 sm:p-4">
        {/* Header Section */}
        <div  ref={defaultTabREf} className="flex flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{agent.name}</h2>
            <p className="text-sm text-neutral-500">{agent.type} Agent</p>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
              ref={isPublicRef}
                type="checkbox"
                className="sr-only peer"
                checked={agent.isPublic}
                onChange={() => {togglePublic()}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Public</span>
            </label>

            <button 
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              onClick={() => {/* Handle exit */}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-500">Total Queries</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">1,234</p>
          </div>
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-500">Tokens Used</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">45.2K</p>
          </div>
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <h3 className="text-sm font-medium text-neutral-500">Avg Response Time</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">1.2s</p>
          </div>
        </div>

        {/* Deploy Modal */}
        <Dialog>
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
    </Button> */}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
{/* 
            <Button variant="default">
              Deploy
            </Button> */}
    
          <Link href={`/ai/chat/${agent.id}`}>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Use
               
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>


          <Button 
            variant="outline"
            onClick={() => {toggleEditing()}}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <FileUploader />
      </div>

      {/* Collapsible Edit Form - Initially hidden */}
      <div ref={editTabRef} className={editing ? 'block' : 'hidden'}>
        <div className="space-y-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Agent Name
            </label>
            <input 
              type="text"
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={agent.name}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Type
            </label>
            <select 
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={agent.type}
            >
              <option value="text">Text</option>
              <option value="content">Content</option>
              <option value="music">Music</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => {toggleEditing()}} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentOptions 
