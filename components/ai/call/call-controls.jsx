import { Plus, Phone,PhoneCall, VolumeX , Mic} from "lucide-react"
const CallControls = () => {
    return ( 
        <>
                  <div className="app-panel flex items-center justify-center space-x-4 rounded-2xl p-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-slate-400">
                New Single Call
              </span>
              <button 
                className="flex h-12 w-12 items-center justify-center rounded bg-[#0B1220] text-white transition-colors hover:bg-white/10"
                aria-label="New Single Call"
              >
                <Phone className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-slate-400">
                Bulk New Calls
              </span>
              <button 
                className="flex h-12 w-12 items-center justify-center rounded bg-[#0B1220] text-white transition-colors hover:bg-white/10"
                aria-label="Bulk New Calls"
              >
                <PhoneCall className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-slate-400">
                Change Voice
              </span>
              <button 
                className="flex h-12 w-12 items-center justify-center rounded bg-[#0B1220] text-white transition-colors hover:bg-white/10"
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
