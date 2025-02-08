
import { ChatInterface } from "@/components/ai/chat/chat-interface";
import { Metadata } from "next";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: 'AI Agent - Text',
  description: 'CustomAI Agent - Text'
}

export default function ChatPage({params}: {params: {slug: string}}) {
  
   metadata.title = params.slug;

  return( 
    <>

  
      <ChatInterface agent_id={params.slug} />
    </>
  


);
}