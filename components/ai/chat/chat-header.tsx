import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
export function ChatHeader({ agent, showButton, showImage }: { agent: any , showButton: boolean, showImage: boolean}) {
  return (
    <div className="border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div> */}
        <div>
          <div className="flex flex-row justify-between w-[35vw] lg:w-[75vw] flex-wrap">


            <div >
              <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {agent?.name}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Your intelligent AI Agent
              </p>
            </div>


            <div>

     {
      showButton ?  (<Link href='/'>
        <Button>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>) : <></>
     }
              { 
                showImage ? ( <Image
                  // src={resolvedTheme === 'dark' ? '/logoDark.png' : '/logoLight.png'}
                  src={'/logos/Sulta/logoLight.png'}
                  alt="Sulta AI Logo"
                  width={72}
                  height={24}
                  priority
              />) : <></>
              }
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}