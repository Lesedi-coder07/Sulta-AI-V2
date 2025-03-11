import ChatPage from "./chat-page";
import { Metadata } from "next";


export const metadata : Metadata = {
  title: "Chat - Sulta AI",
  description: "Chat with Xev 1.0 and get instant responses to your questions",
  icons: {
    icon: "/favicon.png",
    shortcut: { url: "/favicon.png" }
  },
  openGraph: {
    images: [
      {
        url: '/ai-hero.jpg',
        width: 1200,
        height: 800,
        alt: 'Sulta AI Chat Interface',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/ai-hero.jpg'],
    description: "Chat with Xev 1.0 and get instant responses to your questions",
  }
};


export default function Page () {
    return (
        <>
           <ChatPage />
        </>
    )
}