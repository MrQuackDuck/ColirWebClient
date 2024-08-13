import { Loader2 } from "lucide-react"

function Loader() {
  return (
    <div className="flex justify-center items-center pb-16 w-[100%] h-[100%]">
      <Loader2 className='animate-spin m-auto'/>
    </div>
  )
}

export default Loader