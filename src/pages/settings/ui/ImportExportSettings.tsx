import { useImportExportSettings } from '@/shared/lib/hooks/useImportExportSettings';
import { showErrorToast } from '@/shared/lib/showErrorToast';
import { showInfoToast } from '@/shared/lib/showInfoToast';
import { Button } from '@/shared/ui/Button';
import { Separator } from '@/shared/ui/Separator'
import { FileCodeIcon, ImportIcon } from 'lucide-react';
import { useRef } from 'react';

function ImportExportSettings() {
  let fileInputRef = useRef<any>();
  let { exportSettings, importSettings } = useImportExportSettings();

  const handleFileSelect = async (e) => {
    let files = e.target.files as FileList;
    if (files.length != 1) return;

    try {
      await importSettings(files[0]);
      showInfoToast("Settings updated successfully!", "We've updated your settings including the voice settings, room keys etc.");
    }
    catch {
      showErrorToast("Oops! Failed to import settings", "It seems like the file was corrupted");
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Import/Export Settings</span>
      <Separator />
      <div className='flex flex-col gap-1.5 max-w-[28rem]'>
        <div className="flex flex-row gap-1.5">
          <Button onClick={exportSettings} variant={"default"}><FileCodeIcon className="mr-2 h-4 w-4"/> Export settings</Button>
          <input onChange={handleFileSelect} ref={fileInputRef} className='hidden' id='settingsImport' name='settingsImport' type='file' />
          <Button onClick={() => fileInputRef.current.click()} variant={"outline"}><ImportIcon className="mr-2 h-4 w-4"/> Import settings</Button>
        </div>
        <span style={{ "lineBreak": "normal" }} className="text-slate-500 text-sm">Here you can import/export your client settings (i.e. the settings from your browser that aren't stored on the server)</span>
      </div>
    </div>
  )
}

export default ImportExportSettings