import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PanelLeft } from "lucide-react";
export function ChatHeader({ agent, showButton, showImage, handleSidebarToggle }: { agent: any , showButton: boolean, showImage: boolean, handleSidebarToggle: () => void}) {
  return (
    <div className="fixed top-0 left-0 z-40 right-0 border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
       <div className="flex flex-row-reverse justify-between w-full " >
              <h1 className="text-lg flex flex-row  font-semibold text-neutral-900 dark:text-neutral-100">
                {agent?.name} 
              </h1>
              <PanelLeft className="h-5 w-5 md:hidden" onClick={handleSidebarToggle} />
            </div>
      <div className="flex items-center ">
        {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div> */}
        <div>
          <div className="flex flex-row  w-[35vw] lg:w-[75vw] flex-wrap">


           
              

             
           

           

            
            <div>

     {
      showButton ?  (<Link href='/ai/dashboard' className="hidden md:fixed md:top-4 md:left-4 ">
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