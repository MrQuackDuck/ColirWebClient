import "moment/min/locales";

import Moment from "moment/min/moment-with-locales";
import { useContextSelector } from "use-context-selector";

import { TimeFormatSettingsContext } from "../providers/TimeFormatProvider";

export const useFormatDate = (): {
  formatDateShortened: (date: Date) => string;
  formatFullDate: (date: Date) => string;
} => {
  const { timeFormat } = useContextSelector(TimeFormatSettingsContext, (c) => c);

  const formatDateShortened = (date: Date): string => {
    const now = Moment();
    const givenDate = Moment(date);
    const format = timeFormat === "12-hour" ? "h:mm A" : "HH:mm";

    if (givenDate.isSame(now, "day")) {
      return givenDate.format(format);
    }

    if (givenDate.isSame(now.clone().add(1, "day"), "day")) {
      return givenDate.format(`MMM D, ${format}`);
    }

    return givenDate.format(`MMM D, ${format}`);
  };

  const formatFullDate = (date: Date): string => {
    const givenDate = Moment(date);
    const format = timeFormat === "12-hour" ? "h:mm A" : "HH:mm";
    return givenDate.format(`dddd, MMMM D, YYYY ${format}`);
  };

  return { formatDateShortened, formatFullDate };
};