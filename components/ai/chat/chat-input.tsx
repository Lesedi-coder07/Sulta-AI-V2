"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, SendHorizonal, Plus, File, Image} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { convertFileToBase64 } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, base64String: string | null, image: string | null ) => void;
}



export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLDivElement>(null);
  const [uploadedFileName, setUploadFileName] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64String, setFileBase64String ] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null); // New state for image URL
  const imageInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
     
      setUploadFileName(file.name)
      
      const base64String = await convertFileToBase64(file)
      setFileBase64String(base64String)

      const url = URL.createObjectURL(file);
      setImageUrl(url);
   
    }
   
  }
const handleDocUpload = () => {
   
}
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), fileBase64String, imageUrl);
      setMessage("");
      setFileBase64String(null)
      setUploadFileName(null)
      setImageUrl(null)
      if (imageInputRef.current ) {
        imageInputRef.current.value = ""
      }

      if (formRef.current) {
        formRef.current.reset()
       }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleToggleFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.classList.toggle('hidden');
    }
  };



 

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="flex items-end gap-4 pb-[env(safe-area-inset-bottom)]">
          <div className="relative">
          <div ref={fileInputRef} className="hidden p-3 absolute bottom-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
            {uploadedFileName ? (<div className="flex flex-row gap-2">
               <File />
               <p className="text-xs">{uploadedFileName}</p>
            </div>) : (<>
              <input 
                type="file" 
                accept=".jpg, .jpeg, .png, .heic" 
                className="hidden" 
                id="fileInput1" 
                onChange={handleImageUpload}
                ref={imageInputRef}
              />
              <label 
                htmlFor="fileInput1" 
                className="flex flex-row gap-2 w-full px-4 hover:bg-slate-200 py-2 text-sm text-gray-700 bg-white bg-clip-padding rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Upload Image
              
              </label>
              <input 
                type="file" 
                accept=".doc, .docx, .pdf" 
                className="hidden" 
                id="fileInput2" 
                onChange={() => handleImageUpload}
              />
              <label 
                htmlFor="fileInput2" 
                className="mt-2 block w-full hover:bg-slate-200 px-4 py-2 text-sm text-gray-700 bg-white bg-clip-padding rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Upload Document
             
              </label>

            </>) } 
          

            </div>
            <Button
              type="button"
              size="icon"
              className="h-8 w-8 bg-neutral-200 hover:bg-neutral-300"
              onClick={handleToggleFileInput}
            >
              <Plus />
            </Button>
           
          </div>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[20px] max-h-[200px] rounded-small resize-none bg-neutral-100 dark:bg-neutral-800"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-primary/90"
            disabled={!message.trim()}
          >
            <ArrowUp />
          </Button>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}