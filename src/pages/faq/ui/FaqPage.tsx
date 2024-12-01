import { LanguageSettingsContext } from "@/shared/lib/providers/LanguageSettingsProvider";
import PopupWindow from "@/shared/ui/PopupWindow";
import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { importMarkdownFile } from "../lib/importMarkdownFile";
import Markdown from "react-markdown";
import { FaqTabs as FaqTabsEnum } from "../lib/FaqTabs";
import "./FaqPage.css";
import FaqTabs from "./FaqTabs";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/Sheet";
import { Separator } from "@/shared/ui/Separator";
import { Button } from "@/shared/ui/Button";
import { PanelRightCloseIcon } from "lucide-react";
import { FaqControlContext } from "@/features/open-close-faq/libs/providers/FaqControlProvider";

function FaqPage() {
  let { isDesktop } = useResponsiveness();

  const isFaqOpen = useContextSelector(FaqControlContext, (c) => c.isOpen);
  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsOpen);

  const [tab, setTab] = useState(FaqTabsEnum.WhatIsTheMainGoal);

  let [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  let languageCode = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);

  useEffect(() => {
    const loadMarkdown = async () => {
      const content = await importMarkdownFile(FaqTabsEnum[tab], languageCode);
      setMarkdownContent(content);
    };

    loadMarkdown();
  }, [tab, languageCode]);

  useEffect(() => {
    if (!isFaqOpen) setTimeout(() => setTab(FaqTabsEnum.WhatIsTheMainGoal), 50);
  }, [isFaqOpen]);

  return (
    <PopupWindow isOpen={isFaqOpen} setIsOpen={setIsFaqOpen} onEscapePressed={() => setIsFaqOpen(false)}>
      {!isDesktop && (
        <Button onClick={() => setIsSheetOpen(true)} variant={"ghost"} size={"icon"} className="min-w-10 min-h-10">
          <PanelRightCloseIcon className="h-5 w-5 text-slate-400" />
        </Button>
      )}

      <div className="flex flex-row gap-2.5 h-full">
        {isDesktop && (
          <>
            <FaqTabs className="flex flex-col gap-2.5" selectedTab={tab} setSelectedTab={setTab} />
            <Separator className="h-full" orientation="vertical" />
          </>
        )}

        <Markdown className="markdown">{markdownContent}</Markdown>
      </div>

      {!isDesktop && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side={"left"}>
            <SheetTitle className="hidden" />
            <SheetDescription className="hidden" />
            <FaqTabs className="flex flex-col gap-2.5" selectedTab={tab} setSelectedTab={setTab} />
          </SheetContent>
        </Sheet>
      )}
    </PopupWindow>
  );
}

export default FaqPage;
