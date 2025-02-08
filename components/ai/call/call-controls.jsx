import { Plus, Phone,PhoneCall, VolumeX , Mic} from "lucide-react"
const CallControls = () => {
    return ( 
        <>
                  <div className="flex items-center justify-center space-x-4 p-6 border rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                New Single Call
              </span>
              <button 
                className="flex items-center justify-center w-12 h-12 rounded bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                aria-label="New Single Call"
              >
                <Phone className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Bulk New Calls
              </span>
              <button 
                className="flex items-center justify-center w-12 h-12 rounded bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                aria-label="Bulk New Calls"
              >
                <PhoneCall className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Change Voice
              </span>
              <button 
                className="flex items-center justify-center w-12 h-12 rounded bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                aria-label="Change Voice"
              >
                <Mic className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </>
     );
}
 
export default CallControls;