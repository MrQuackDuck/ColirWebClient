import { useImportExportSettings } from "@/shared/lib/hooks/useImportExportSettings";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";
import { useInfoToast } from "@/shared/lib/hooks/useInfoToast";
import { Button } from "@/shared/ui/Button";
import { Separator } from "@/shared/ui/Separator";
import { FileCodeIcon, ImportIcon } from "lucide-react";
import { useRef } from "react";

function ImportExportSettings() {
  const t = useTranslation();
  const showInfoToast = useInfoToast();
  const showErrorToast = useErrorToast();
  let fileInputRef = useRef<any>();
  let { exportSettings, importSettings } = useImportExportSettings();

  const handleFileSelect = async (e) => {
    let files = e.target.files as FileList;
    if (files.length != 1) return;

    try {
      await importSettings(files[0]);
      showInfoToast(t("SETTINGS_UPDATED_SUCCESSFULLY"), t("SETTINGS_UPDATED_SUCCESSFULLY_DESCRIPTION"));
    } catch {
      showErrorToast(t("FAILED_TO_IMPORT_SETTINGS"), t("FAILED_TO_IMPORT_SETTINGS_DESCRIPTION"));
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">{t("IMPORT_EXPORT_SETTINGS")}</span>
      <Separator />
      <div className="flex flex-col gap-1.5 max-w-[28rem]">
        <div className="flex flex-row gap-1.5">
          <Button onClick={exportSettings} variant={"default"}>
            <FileCodeIcon className="mr-2 h-4 w-4" /> {t("EXPORT_SETTINGS")}
          </Button>
          <input onChange={handleFileSelect} ref={fileInputRef} className="hidden" id="settingsImport" name="settingsImport" type="file" />
          <Button onClick={() => fileInputRef.current.click()} variant={"outline"}>
            <ImportIcon className="mr-2 h-4 w-4" /> {t("IMPORT_SETTINGS")}
          </Button>
        </div>
        <span style={{ lineBreak: "normal" }} className="text-slate-500 text-sm">
          {t("IMPORT_EXPORT_SETTINGS_DESCRIPTION")}
        </span>
      </div>
    </div>
  );
}

export default ImportExportSettings;
