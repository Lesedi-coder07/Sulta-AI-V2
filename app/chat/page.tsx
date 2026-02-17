import ChatPage from "./chat-page";
import { Metadata } from "next";


export const metadata : Metadata = {
  title: "Shopfront Support Demo - Sulta AI",
  description: "Interactive customer service demo showing live agent role, tone, and action controls.",
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
        alt: 'Sulta AI Shopfront Support Demo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/ai-hero.jpg'],
    description: "Interactive customer service demo with live persona controls.",
  }
};


export default function Page () {
    return (
        <>
           <ChatPage />
        </>
    )
}
