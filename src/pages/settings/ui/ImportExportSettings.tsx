import { useResponsiveness } from '@/shared/lib/hooks/useResponsiveness';
import { cn } from '@/shared/lib/utils';
import { Separator } from '@/shared/ui/Separator'

function ImportExportSettings() {
  let { isDesktop } = useResponsiveness();

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Import/Export Settings</span>
      <Separator />
      <div className={cn("flex flex-col gap-3.5", isDesktop && "max-w-[50%]")}>
        Here
      </div>
    </div>
  )
}

export default ImportExportSettings