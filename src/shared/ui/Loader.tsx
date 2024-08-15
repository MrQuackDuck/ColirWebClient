import { Loader2 } from "lucide-react"

function Loader() {
  return (
    <div className="flex absolute z-40 bg-background justify-center items-center pb-16 w-[100%] h-[100%]">
      <Loader2 className='relative z-10 animate-spin m-auto'/>
    </div>
  )
}

export default Loader