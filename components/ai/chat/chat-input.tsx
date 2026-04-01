"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, File, Globe, Image, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/app/api/firebase/firebaseConfig"; // Import your Firebase configuration
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { convertFileToBase64 } from "@/lib/utils";
import { storage } from "@/app/api/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UIMessage } from "ai";
interface ChatInputProps {
  sendMessage: (message: string, imageBase64?: string | null) => void;
  thinkEnabled: boolean;
  onThinkToggle: (enabled: boolean) => void;
}




export function ChatInput({ sendMessage, thinkEnabled, onThinkToggle }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLDivElement>(null);
  const [uploadedFileName, setUploadFileName] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64String, setFileBase64String] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null); // New state for image URL
  const imageInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [showFileInput, setShowFileInput] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false)
  const [imageGenEnabled, setImageGenEnabled] = useState<boolean>(false);
  const [powerUpSelected, setPowerUpSelected] = useState<string | null>(null);


  const handleDocUpload: React.ChangeEventHandler<HTMLInputElement> = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadFileName(file.name);
      setIsUploading(true);

      try {
        // Create a storage reference
        const storageRef = ref(storage, `uploads/documents/${Date.now()}-${file.name}`);

        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef);
        setDocUrl(downloadUrl);

        // You might want to update the message to indicate a document was attached
        // setMessage(prev => prev + `\n[Document attached: ${file.name}]`);
        console.log("docUrl", downloadUrl)
      } catch (error) {
        console.error('Error uploading document:', error);
        // Handle error appropriately
      } finally {
        setIsUploading(false);
      }
    }
  };



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

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim(), fileBase64String);
      setMessage("");
      setFileBase64String(null)
      setUploadFileName(null)
      setImageUrl(null)
      setDocUrl(null)
      setShowFileInput(false)
      if (imageInputRef.current) {
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

  const handlePowerUp = (powerUpSelected: string): void => {
    if (powerUpSelected === 'think') {
      setSearchEnabled(false)
      setImageGenEnabled(false)
      onThinkToggle(!thinkEnabled)
      setPowerUpSelected(powerUpSelected)
    } else if (powerUpSelected === 'search') {
      setImageGenEnabled(false)
      onThinkToggle(false)
      setSearchEnabled(!searchEnabled)
      setPowerUpSelected(powerUpSelected)
    } else {
      onThinkToggle(false)
      setSearchEnabled(false)
      setImageGenEnabled(!imageGenEnabled)
      setPowerUpSelected(powerUpSelected)
    }
  }



  return (
    <div className="fixed bottom-0 left-0 right-0 w-full border-t border-white/6 bg-[#141414]/90 px-4 py-6 backdrop-blur-md">
      <div className="max-w-3xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="w-full">
          {/* Main Input Container */}
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="min-h-[24px] max-h-[200px] flex-1 resize-none border-0 bg-transparent px-2 text-sm text-white/90 placeholder:text-white/25 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />

            {/* Right Side Buttons */}
            <div className="flex items-center gap-2">
              {/* Attach Button */}
              <div className="relative">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full hover:bg-white/6"
                  onClick={handleToggleFileInput}
                >
                  <Paperclip className="h-5 w-5 text-white/30" />
                </Button>

                {/* File Upload Dropdown */}
                <div
                  ref={fileInputRef}
                  className={`absolute bottom-full right-0 z-50 mb-2 w-56 rounded-lg border border-white/8 bg-[#141414] py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)] ${showFileInput ? '' : 'hidden'}`}
                >
                  {uploadedFileName ? (
                    <div className="flex items-center gap-2 px-4 py-2">
                      <File className="h-4 w-4 text-slate-400" />
                      <p className="truncate text-sm text-slate-200">{uploadedFileName}</p>
                    </div>
                  ) : (
                    <>
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
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/5"
                      >
                        <Image className="h-4 w-4" />
                        <span>Upload Image</span>
                      </label>
                      <input
                        type="file"
                        accept=".doc, .docx, .pdf"
                        className="hidden"
                        id="fileInput2"
                        onChange={handleDocUpload}
                      />
                      <label
                        htmlFor="fileInput2"
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/5"
                      >
                        <File className="h-4 w-4" />
                        <span>Upload Document</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Think Toggle Button */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={`h-10 w-10 rounded-full transition-all duration-200 ${thinkEnabled
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:bg-white/6 hover:text-white/60'
                  }`}
                onClick={() => onThinkToggle(!thinkEnabled)}
                title={thinkEnabled ? 'Thinking mode ON (uses Gemini 3 Pro)' : 'Enable thinking mode'}
              >
                <Brain className="h-5 w-5" />
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-full bg-white text-slate-950 transition-colors hover:bg-slate-200"
                disabled={!message.trim() || isUploading}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export const writeMessageToDb = async (chatId: string, messageContent: string, sender: string, imageUrl: string | null, docUrl: string | null) => {
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const newMessage = {
      content: messageContent,
      id: Date.now().toString(),
      role: sender,
      timestamp: serverTimestamp(),
      image: imageUrl,
      docUrl: docUrl
    };

    console.log(newMessage)

    // Add the new message to the messages subcollection
    await addDoc(messagesRef, newMessage);
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message: ', error);
  }
};
