import { useImportExportSettings } from '@/shared/lib/hooks/useImportExportSettings';
import { Button } from '@/shared/ui/Button';
import { Separator } from '@/shared/ui/Separator'
import { FileCodeIcon, ImportIcon } from 'lucide-react';

function ImportExportSettings() {
  let { exportSettings } = useImportExportSettings();

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Import/Export Settings</span>
      <Separator />
      <div className="flex flex-row gap-1.5">
        <Button onClick={exportSettings} variant={"default"}><FileCodeIcon className="mr-2 h-4 w-4"/> Export settings</Button>
        <Button variant={"outline"}><ImportIcon className="mr-2 h-4 w-4"/> Import settings</Button>
      </div>
    </div>
  )
}

export default ImportExportSettings