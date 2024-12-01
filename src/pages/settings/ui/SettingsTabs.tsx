import { BarChart3Icon, GlobeIcon, ImportIcon, MegaphoneIcon, UserIcon, Volume2Icon } from "lucide-react";
import { Separator } from "@/shared/ui/Separator";
import Tab from "@/shared/ui/Tab";
import HeaderTab from "@/shared/ui/HeaderTab";
import { SettingsTabs as SettingsTabsEnum } from "../lib/SettingsTabs";

interface SettingsTabsProps {
  className?: string;
  selectedTab: SettingsTabsEnum;
  setSelectedTab: React.Dispatch<React.SetStateAction<SettingsTabsEnum>>;
}

function SettingsTabs({ className, selectedTab, setSelectedTab }: SettingsTabsProps) {
  return (
    <div className={className}>
      <HeaderTab>Settings</HeaderTab>
      <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Account} onClick={() => setSelectedTab(SettingsTabsEnum.Account)}>
        <UserIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Account
      </Tab>
      <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.VoiceSettings} onClick={() => setSelectedTab(SettingsTabsEnum.VoiceSettings)}>
        <Volume2Icon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Voice Settings
      </Tab>
      <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Notifications} onClick={() => setSelectedTab(SettingsTabsEnum.Notifications)}>
        <MegaphoneIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Notifications & Sounds
      </Tab>
      <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Statistics} onClick={() => setSelectedTab(SettingsTabsEnum.Statistics)}>
        <BarChart3Icon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Statistics
      </Tab>
      <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.Language} onClick={() => setSelectedTab(SettingsTabsEnum.Language)}>
        <GlobeIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Language
      </Tab>
      <Separator orientation="horizontal" />
      <Tab className="w-full" isSelected={selectedTab == SettingsTabsEnum.ImportExport} onClick={() => setSelectedTab(SettingsTabsEnum.ImportExport)}>
        <ImportIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5} /> Import/Export Settings
      </Tab>
    </div>
  );
}

export default SettingsTabs;
