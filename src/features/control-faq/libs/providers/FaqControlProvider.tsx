import { FaqTabs } from "@/pages/faq/model/FaqTabs";
import { useState } from "react";
import { createContext } from "use-context-selector";

export const FaqControlContext = createContext<{
  isFaqOpen: boolean;
  setIsFaqOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFaqTab: FaqTabs;
  setSelectedFaqTab: React.Dispatch<React.SetStateAction<FaqTabs>>;
}>({
  isFaqOpen: false,
  setIsFaqOpen: () => {},
  selectedFaqTab: FaqTabs.WhatIsTheMainGoal,
  setSelectedFaqTab: () => {}
});

export const FaqControlProvider = ({ children }) => {
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [selectedFaqTab, setSelectedFaqTab] = useState<FaqTabs>(FaqTabs.WhatIsTheMainGoal);

  return <FaqControlContext.Provider value={{ isFaqOpen, setIsFaqOpen, selectedFaqTab, setSelectedFaqTab }}>{children}</FaqControlContext.Provider>;
};
