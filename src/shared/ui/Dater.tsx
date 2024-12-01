import Moment from "moment";

interface DaterProps {
  date: Date;
}

function Dater(props: DaterProps) {
  return (
    <div className="flex w-fit my-3 mx-auto justify-center select-none">
      <div className="w-0 h-0 border-b-[20px] border-r-[20px] border-b-transparent border-r-primary/10"></div>
      <div className="flex items-center text-[10px] font-medium px-10 text-primary/75 bg-primary/10">{Moment(props.date).format("MMMM D")}</div>
      <div className="w-0 h-0 border-t-[20px] border-l-[20px] border-t-transparent border-l-primary/10"></div>
    </div>
  );
}

export default Dater;
