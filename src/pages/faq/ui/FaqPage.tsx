import { LanguageSettingsContext } from "@/shared/lib/providers/LanguageSettingsProvider";
import PopupWindow from "@/shared/ui/PopupWindow";
import { useEffect, useRef, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { importMarkdownFile } from "../lib/importMarkdownFile";
import Markdown from "react-markdown";
import { FaqTabs as FaqTabsEnum } from "../model/FaqTabs";
import "./FaqPage.css";
import FaqTabs from "./FaqTabs";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/Sheet";
import { Separator } from "@/shared/ui/Separator";
import { Button } from "@/shared/ui/Button";
import { Loader2Icon, PanelRightCloseIcon } from "lucide-react";
import { FaqControlContext } from "@/features/control-faq/libs/providers/FaqControlProvider";
import { ScrollArea } from "@/shared/ui/ScrollArea";
import rehypeRaw from "rehype-raw";
import { AuthContext } from "@/features/authorize/lib/providers/AuthProvider";

function FaqPage() {
  let { isDesktop } = useResponsiveness();

  const [isLoading, setIsLoading] = useState(true);

  const isFaqOpen = useContextSelector(FaqControlContext, (c) => c.isFaqOpen);
  const setIsFaqOpen = useContextSelector(FaqControlContext, (c) => c.setIsFaqOpen);

  const selectedFaqTab = useContextSelector(FaqControlContext, (c) => c.selectedFaqTab);
  const selectedFaqTabRef = useRef(selectedFaqTab);
  const setSelectedFaqTab = useContextSelector(FaqControlContext, (c) => c.setSelectedFaqTab);

  let [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  let languageCode = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);
  let isAuthorized = useContextSelector(AuthContext, (c) => c.isAuthorized);

  useEffect(() => {
    if (!isAuthorized) setIsFaqOpen(false);
  }, [isAuthorized]);

  useEffect(() => {
    selectedFaqTabRef.current = selectedFaqTab;
  }, [selectedFaqTab]);

  useEffect(() => {
    const loadMarkdown = async () => {
      const content = await importMarkdownFile(FaqTabsEnum[selectedFaqTab], languageCode);
      if (selectedFaqTabRef.current === selectedFaqTab)
      setMarkdownContent(content);
    };

    setIsLoading(true);
    loadMarkdown().then(() => setIsLoading(false));
  }, [selectedFaqTab, languageCode]);

  useEffect(() => {
    if (!isFaqOpen) setTimeout(() => setSelectedFaqTab(FaqTabsEnum.WhatIsTheMainGoal), 50);
  }, [isFaqOpen]);

  return (
    <PopupWindow isOpen={isFaqOpen} setIsOpen={setIsFaqOpen} onEscapePressed={() => setIsFaqOpen(false)}>
      {!isDesktop && (
        <Button onClick={() => setIsSheetOpen(true)} variant={"ghost"} size={"icon"} className="min-w-10 min-h-10">
          <PanelRightCloseIcon className="h-5 w-5 text-slate-400" />
        </Button>
      )}

      <div className="flex flex-row gap-1 h-full">
        {isDesktop && (
          <>
            <FaqTabs className="flex flex-col gap-2.5" selectedTab={selectedFaqTab} setSelectedTab={setSelectedFaqTab} />
            <Separator className="h-full" orientation="vertical" />
          </>
        )}

        {isLoading && (
          <div className="flex justify-center items-center w-full h-full">
            <Loader2Icon className="w-5 animate-spin" />
          </div>
        )}
        {!isLoading && (
          <ScrollArea className="w-full">
            <Markdown className="markdown pl-4 pr-12 pt-5" rehypePlugins={[rehypeRaw]}>{markdownContent}</Markdown>
          </ScrollArea>
        )}
      </div>

      {!isDesktop && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side={"left"}>
            <SheetTitle className="hidden" />
            <SheetDescription className="hidden" />
            <FaqTabs className="flex flex-col gap-2.5" selectedTab={selectedFaqTab} setSelectedTab={setSelectedFaqTab} />
          </SheetContent>
        </Sheet>
      )}
    </PopupWindow>
  );
}

export default FaqPage;
