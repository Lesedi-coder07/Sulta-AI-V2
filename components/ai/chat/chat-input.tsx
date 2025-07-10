"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Plus, File, Globe, Image, Brain} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/app/api/firebase/firebaseConfig"; // Import your Firebase configuration
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { convertFileToBase64 } from "@/lib/utils";
import { storage } from "@/app/api/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
interface ChatInputProps {
  handleSendMessage: (message: string, base64String: string | null, image: string | null, docUrl: string | null, powerUpSelected: string | null) => void;
}





export function ChatInput({ handleSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLDivElement>(null);
  const [uploadedFileName, setUploadFileName] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64String, setFileBase64String ] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null); // New state for image URL
  const imageInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [showFileInput, setShowFileInput] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false)
  const [thinkEnabled, setThinkEnabled] = useState<boolean>(false)
  const [imageGenEnabled , setImageGenEnabled] = useState<boolean>(false);
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
      handleSendMessage(message.trim(), fileBase64String, imageUrl, docUrl, powerUpSelected);
      setMessage("");
      setFileBase64String(null)
      setUploadFileName(null)
      setImageUrl(null)
      setDocUrl(null)
      setShowFileInput(false)
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

  const handlePowerUp = (powerUpSelected: string): void => {
     if (powerUpSelected === 'think') {
       setSearchEnabled(false)
       setImageGenEnabled(false)
       setThinkEnabled(!thinkEnabled)
       setPowerUpSelected(powerUpSelected)
     } else if (powerUpSelected === 'search') {
        setImageGenEnabled(false)
        setThinkEnabled(false)
        setSearchEnabled(!searchEnabled)
        setPowerUpSelected(powerUpSelected)
     } else {
        setThinkEnabled(false)
        setSearchEnabled(false)
        setImageGenEnabled(!imageGenEnabled)
        setPowerUpSelected(powerUpSelected)
     }
  }

 

  return (
    // <div className="fixed bottom-0 right-0 md:flex md:flex-row-reverse pl-44  border-neutral-200 md:flex-center w-full p-4 dark:border-neutral-800 dark:bg-neutral-900 flex justify-center">
    //   <form ref={formRef} onSubmit={handleSubmit}  className="bg-red-500 max-w-3xl">
    //     <div className="flex items-end gap-4 pb-[env(safe-area-inset-bottom)]">
    //       <div className="relative">
    //       <div ref={fileInputRef} className="hidden p-3 absolute bottom-full  mt-2 w-48 bg-white shadow-lg rounded-md py-2">
    //         {uploadedFileName ? (<div className="flex flex-row gap-2">
    //            <File />
    //            <p className="text-xs">{uploadedFileName}</p>
    //         </div>) : (<>
    //           <input 
    //             type="file" 
    //             accept=".jpg, .jpeg, .png, .heic" 
    //             className="hidden" 
    //             id="fileInput1" 
    //             onChange={handleImageUpload}
    //             ref={imageInputRef}
    //           />
    //           <label 
    //             htmlFor="fileInput1" 
    //             className="flex flex-row gap-2 w-full px-4 hover:bg-slate-200 py-2 text-sm text-gray-700 bg-white bg-clip-padding rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
    //           >
    //             Upload Image
              
    //           </label>
    //           <input 
    //             type="file" 
    //             accept=".doc, .docx, .pdf" 
    //             className="hidden" 
    //             id="fileInput2" 
    //             onChange={() => handleImageUpload}
    //           />
    //           <label 
    //             htmlFor="fileInput2" 
    //             className="mt-2 block w-full hover:bg-slate-200 px-4 py-2 text-sm text-gray-700 bg-white bg-clip-padding rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
    //           >
    //             Upload Document
             
    //           </label>

    //         </>) } 
          

    //         </div>
    //         <Button
    //           type="button"
    //           size="icon"
    //           className="h-8 w-8 bg-neutral-200 hover:bg-neutral-300"
    //           onClick={handleToggleFileInput}
    //         >
    //           <Plus />
    //         </Button>
           
    //       </div>
    //       <Textarea
    //         ref={textareaRef}
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         onKeyDown={handleKeyDown}
    //         placeholder="Type your message..."
    //         className="min-h-[20px] max-h-[200px] rounded-small resize-none bg-neutral-100 dark:bg-neutral-800"
    //         rows={1}
    //       />
    //       <Button
    //         type="submit"
    //         size="icon"
    //         className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-primary/90"
    //         disabled={!message.trim()}
    //       >
    //         <ArrowUp />
    //       </Button>
    //     </div>
    //     <p className="mt-2 text-xs text-neutral-500">
    //       Press Enter to send, Shift + Enter for new line
    //     </p>
    //   </form>
    // </div>
    <div className="fixed bottom-0 left-0 right-0 md:pl-64 bg-white border-neutral-200 w-full p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-4xl w-full">
        <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)] relative">
          {/* Textarea with integrated send button styling */}
          <div className="flex-grow relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[40px] max-h-[300px] h-[100px] py-10 rounded-md resize-none bg-neutral-100 dark:bg-neutral-800 w-full shadow-md pr-12 pl-3"
              rows={1}
            />
            {/* Send Button (positioned inside textarea) */}
            <Button
              type="submit"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 h-10 w-10 shrink-0 bg-blue-600 hover:bg-primary/90 rounded-md"
              disabled={!message.trim()}
            >
              <ArrowUp />
            </Button>
          </div>

          {/* Plus Button (file upload toggle) */}
          <div ref={fileInputRef} className={`absolute bottom-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 ${showFileInput ? '' : 'hidden'}`}>
            {uploadedFileName ? (
              <div className="flex flex-row gap-2 px-4 py-2">
                <File />
                <p className="text-xs">{uploadedFileName}</p>
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
                  className="flex flex-row gap-2 w-full px-4 hover:bg-slate-200 py-2 text-sm text-gray-700 bg-white bg-clip-padding rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  Upload Image
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
                  className="mt-2 block w-full hover:bg-slate-200 px-4 py-2 text-sm text-gray-700 bg-white bg-clip-padding rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  Upload Document
                </label>
              </>
            )}
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

        <div className="flex-wrap gap-2 pt-3 hidden">
          <button onClick={() => handlePowerUp('search')} className={`flex flex-row items-center bg-neutral-100 dark:bg-neutral-800 p-2 md:p-3 rounded-sm cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 ${searchEnabled ? 'bg-neutral-200 dark:bg-neutral-700 border border-blue-500' : ''}`}>
            <Globe className="h-4 w-4 md:h-5 md:w-5" />
            <p className="text-xs ml-2 md:ml-3 dark:text-neutral-200">Search</p>
          </button>

          <button onClick={() => handlePowerUp('imageGen')} className={`flex flex-row items-center bg-neutral-100 dark:bg-neutral-800 p-2 md:p-3 rounded-sm cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 ${imageGenEnabled ? 'bg-neutral-200 dark:bg-neutral-700 border border-blue-500' : ''}`}>
            <Image className="h-4 w-4 md:h-5 md:w-5" />
            <p className="text-xs ml-2 md:ml-3 dark:text-neutral-200">Generate Image</p>
          </button>

          <button onClick={() => handlePowerUp('think')} className={`flex flex-row items-center bg-neutral-100 dark:bg-neutral-800 p-2 md:p-3 rounded-sm cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 ${thinkEnabled ? 'bg-neutral-200 dark:bg-neutral-700 border border-blue-500' : ''}`}>
            <Brain className="h-4 w-4 md:h-5 md:w-5" />
            <p className="text-xs ml-2 md:ml-3 dark:text-neutral-200">Deep Think</p>
          </button>
        </div>

        
      </form>
    </div>
  );
}

export const writeMessageToDb = async (chatId: string , messageContent:string , sender: string, imageUrl: string | null, docUrl: string | null) => {
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