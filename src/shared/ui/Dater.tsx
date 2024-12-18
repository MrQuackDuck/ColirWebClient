import "moment/min/locales";

import moment from "moment/min/moment-with-locales";
import { useContextSelector } from "use-context-selector";

import { LanguageSettingsContext } from "../lib/providers/LanguageSettingsProvider";

interface DaterProps {
  date: Date;
}

export function Dater(props: DaterProps) {
  const currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);
  moment.locale(currentLanguage);

  const formattedDate = moment(props.date).format("MMMM D");

  return (
    <div className="flex w-fit my-3 mx-auto justify-center select-none">
      <div className="w-0 h-0 border-b-[20px] border-r-[20px] border-b-transparent border-r-primary/10"></div>
      <div className="flex items-center text-[10px] font-medium px-10 text-primary/75 bg-primary/10 capitalize">{formattedDate}</div>
      <div className="w-0 h-0 border-t-[20px] border-l-[20px] border-t-transparent border-l-primary/10"></div>
    </div>
  );
}
