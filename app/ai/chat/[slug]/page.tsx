
import { ChatInterface } from "@/components/ai/chat/chat-interface";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'AI Agent - Sulta AI',
  description: 'Custom AI Agent - Text',
  icons: {
    icon: "/favicon.png",
},
}

export default function ChatPage({params}: {params: {slug: string}}) {
  
   

  return( 
    <>

  
      <ChatInterface agent_id={params.slug} />
    </>
  


);
}