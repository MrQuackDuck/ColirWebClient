import { ArrowLeftIcon, RepeatIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useTranslation } from "@/shared/lib";
import { Button, CardContent, CardHeader, CardTitle, ListHexSelector, Separator } from "@/shared/ui";

function ChooseColirIdForm({ colors, onProceed, onRegenerate, onBack }: { colors: number[]; onProceed: (color) => void; onRegenerate: () => void; onBack: () => void }) {
  const t = useTranslation();
  const [selectedHexId, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    setSelectedColor(colors[0]);
  }, [colors]);

  function back(e) {
    e.preventDefault();
    onBack();
  }

  function submit() {
    onProceed(selectedHexId);
  }

  return (
    <div className="animate-appearance opacity-25">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-row justify-between items-center">
          <Button onClick={back} variant={"outline"} className="w-9 h-9" size={"icon"}>
            <ArrowLeftIcon strokeWidth={2.5} className="h-4 w-4" />
          </Button>
          <CardTitle className="text-[20px]">{t("CHOOSE_COLIR_ID")}</CardTitle>
          <Button variant={"outline"} className="invisible" size={"icon"}>
            Boilerplate
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <ListHexSelector onSelected={(color) => setSelectedColor(color)} colors={colors} />
        <Button variant={"outline"} onClick={onRegenerate}>
          {t("REGENERATE")} <RepeatIcon className="ml-1 h-4 w-4" />
        </Button>
        <Button onClick={submit}>{t("FINISH")}</Button>
      </CardContent>
    </div>
  );
}

export default ChooseColirIdForm;
