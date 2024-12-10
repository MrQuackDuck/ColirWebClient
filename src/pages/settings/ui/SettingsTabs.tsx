import { BarChart3Icon, GlobeIcon, ImportIcon, MegaphoneIcon, UserIcon, Volume2Icon } from "lucide-react";
import { Separator } from "@/shared/ui/Separator";
import Tab from "@/shared/ui/Tab";
import HeaderTab from "@/shared/ui/HeaderTab";
import { SettingsTabs as SettingsTabsEnum } from "../lib/SettingsTabs";
import { ScrollArea } from "@/shared/ui/ScrollArea";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

interface SettingsTabsProps {
  className?: string;
  selectedTab: SettingsTabsEnum;
  setSelectedTab: React.Dispatch<React.SetStateAction<SettingsTabsEnum>>;
}

function SettingsTabs({ className, selectedTab, setSelectedTab }: SettingsTabsProps) {
  const t = useTranslation();

  return (
    <ScrollArea className="pr-2.5">
      <div className={className}>
        <HeaderTab>{t("SETTINGS")}</HeaderTab>
        <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Account} onClick={() => setSelectedTab(SettingsTabsEnum.Account)}>
          <UserIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("ACCOUNT")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.VoiceSettings} onClick={() => setSelectedTab(SettingsTabsEnum.VoiceSettings)}>
          <Volume2Icon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("VOICE_SETTINGS")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Notifications} onClick={() => setSelectedTab(SettingsTabsEnum.Notifications)}>
          <MegaphoneIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("NOTIFICATIONS_AND_SOUNDS")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Statistics} onClick={() => setSelectedTab(SettingsTabsEnum.Statistics)}>
          <BarChart3Icon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("STATISTICS")}
        </Tab>
        <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Language} onClick={() => setSelectedTab(SettingsTabsEnum.Language)}>
          <GlobeIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("LANGUAGE")}
        </Tab>
        <Separator orientation="horizontal" />
        <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.ImportExport} onClick={() => setSelectedTab(SettingsTabsEnum.ImportExport)}>
          <ImportIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> {t("IMPORT_EXPORT_SETTINGS")}
        </Tab>
      </div>
    </ScrollArea>
  );
}

export default SettingsTabs;