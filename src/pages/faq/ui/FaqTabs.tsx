import React from "react";
import { FaqTabs as FaqTabsEnum } from "../lib/FaqTabs";
import HeaderTab from "@/shared/ui/HeaderTab";
import Tab from "@/shared/ui/Tab";
import { BookIcon, BrushIcon, DnaIcon, DollarSignIcon, InfoIcon, KeyIcon, LibraryIcon, LightbulbIcon } from "lucide-react";
import { ScrollArea } from "@/shared/ui/ScrollArea";

interface FaqTabsProps {
  className?: string;
  selectedTab: FaqTabsEnum;
  setSelectedTab: React.Dispatch<React.SetStateAction<FaqTabsEnum>>;
}

function FaqTabs({ className, selectedTab, setSelectedTab }: FaqTabsProps) {
  return (
    <ScrollArea className="pr-3">
      <div className={className}>
        <HeaderTab>FAQ</HeaderTab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsTheMainGoal} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsTheMainGoal)}>
          <LightbulbIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> What is the main goal?
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhyDoYouNeedAuth} onClick={() => setSelectedTab(FaqTabsEnum.WhyDoYouNeedAuth)}>
          <InfoIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Why do you need auth?
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.HowKeysWork} onClick={() => setSelectedTab(FaqTabsEnum.HowKeysWork)}>
          <KeyIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> How keys work?
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsRoom} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsRoom)}>
          <DollarSignIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> What is room?
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsGuid} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsGuid)}>
          <DnaIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> What is guid?
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsColirId} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsColirId)}>
          <BrushIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> What is Colir ID?
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.HowStatsWork} onClick={() => setSelectedTab(FaqTabsEnum.HowStatsWork)}>
          <BookIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> How stats work?
        </Tab>
        <HeaderTab>References</HeaderTab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.LibsReferences} onClick={() => setSelectedTab(FaqTabsEnum.LibsReferences)}>
          <LibraryIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> UI Libs & Frameworks
        </Tab>
      </div>
    </ScrollArea>
  );
}

export default FaqTabs;
