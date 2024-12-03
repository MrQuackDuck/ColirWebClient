import React from "react";
import { FaqTabs as FaqTabsEnum } from "../lib/FaqTabs";
import HeaderTab from "@/shared/ui/HeaderTab";
import Tab from "@/shared/ui/Tab";
import { BookIcon, BrushIcon, DnaIcon, DollarSignIcon, InfoIcon, KeyIcon, LibraryIcon, LightbulbIcon } from "lucide-react";
import { ScrollArea } from "@/shared/ui/ScrollArea";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

interface FaqTabsProps {
  className?: string;
  selectedTab: FaqTabsEnum;
  setSelectedTab: React.Dispatch<React.SetStateAction<FaqTabsEnum>>;
}

function FaqTabs({ className, selectedTab, setSelectedTab }: FaqTabsProps) {
  const t = useTranslation();

  return (
    <ScrollArea className="pr-3">
      <div className={className}>
        <HeaderTab>{t("FAQ")}</HeaderTab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsTheMainGoal} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsTheMainGoal)}>
          <LightbulbIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("WHAT_IS_THE_MAIN_GOAL")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhyDoYouNeedAuth} onClick={() => setSelectedTab(FaqTabsEnum.WhyDoYouNeedAuth)}>
          <InfoIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("WHY_DO_YOU_NEED_AUTH")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.HowKeysWork} onClick={() => setSelectedTab(FaqTabsEnum.HowKeysWork)}>
          <KeyIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("HOW_KEYS_WORK")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsRoom} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsRoom)}>
          <DollarSignIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("WHAT_IS_ROOM")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsGuid} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsGuid)}>
          <DnaIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("WHAT_IS_GUID")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.WhatIsColirId} onClick={() => setSelectedTab(FaqTabsEnum.WhatIsColirId)}>
          <BrushIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("WHAT_IS_COLIR_ID")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.HowStatsWork} onClick={() => setSelectedTab(FaqTabsEnum.HowStatsWork)}>
          <BookIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("HOW_STATS_WORK")}
        </Tab>
        <HeaderTab>{t("REFERENCES")}</HeaderTab>
        <Tab className="w-full" isSelected={selectedTab == FaqTabsEnum.LibsReferences} onClick={() => setSelectedTab(FaqTabsEnum.LibsReferences)}>
          <LibraryIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("UI_LIBS_FRAMEROWKS")}
        </Tab>
      </div>
    </ScrollArea>
  );
}

export default FaqTabs;
