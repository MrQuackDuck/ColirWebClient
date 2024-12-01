import { FaqTabs } from "@/pages/faq/lib/FaqTabs";
import { useState } from "react";
import { createContext } from "use-context-selector";

export const FaqControlContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTab: FaqTabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<FaqTabs>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  selectedTab: FaqTabs.WhatIsTheMainGoal,
  setSelectedTab: () => {},
});

export const FaqControlProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<FaqTabs>(FaqTabs.WhatIsTheMainGoal);

  return (
    <FaqControlContext.Provider value={{ isOpen, setIsOpen, selectedTab, setSelectedTab }}>
      {children}
    </FaqControlContext.Provider>
  );
};