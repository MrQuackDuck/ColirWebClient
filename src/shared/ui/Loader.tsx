import { Loader2 } from "lucide-react"

function Loader() {
  return (
    <div className="flex fixed z-30 bg-background justify-center items-center w-[100%] h-[100%]">
      <Loader2 className='w-5 relative z-10 animate-spin m-auto'/>
    </div>
  )
}

export default Loader