
import Moment from "moment";

interface DaterProps {
  date: Date
}

function Dater(props: DaterProps) {
  return (<div className="flex w-fit my-3 mx-auto justify-center select-none">
    <div className="w-0 h-0 border-primary/10 border-r-[15px] border-b-[20px] border-b-transparent"></div>
    <div className="flex items-center text-[10px] font-medium px-10 text-primary/70 bg-primary/10">{Moment(props.date).format("MMMM D")}</div>
    <div className="w-0 h-0 border-primary/10 border-l-[15px] border-b-[20px] border-b-transparent"></div>
  </div>)
}

export default Dater