import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/Card";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/shared/ui/Input";
import { useEffect, useState } from "react";
import { BrushIcon } from "lucide-react";
import { decimalToHexString } from "@/shared/lib/utils";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

interface AccountDeleteConfirmationDialogProps {
  hexId: number;
  isShown: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function AccountDeleteConfirmationDialog(props: AccountDeleteConfirmationDialogProps) {
  const t = useTranslation();
  const [enteredHexId, setEnteredHexId] = useState("");
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);

  useEffect(() => {
    if (decimalToHexString(props.hexId) == enteredHexId.toUpperCase()) setDeleteButtonEnabled(true);
    else setDeleteButtonEnabled(false);
  }, [enteredHexId, props.hexId]);

  function handleClose() {
    setEnteredHexId("");
    setDeleteButtonEnabled(false);
    props.onCancel();
  }

  return (
    <Dialog open={props.isShown} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("ARE_YOU_SURE")}</CardTitle>
            <CardDescription>{t("YOU_ARE_ABOUT_TO_DELETE_YOUR_ACCOUNT")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{t("ENTER_COLIR_ID_TO_CONFIRM")}</span>
              <div className="relative flex items-center">
                <BrushIcon strokeWidth={2.5} className="absolute z-10 pointer-events-none stroke-slate-400 left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input value={enteredHexId} onChange={(e) => setEnteredHexId(e.target.value)} type="text" autoComplete="off" placeholder="#FF0000" className="pl-7" />
              </div>
            </div>
            <div className="pt-2 flex flex-row gap-2">
              <Button onClick={() => props.onCancel()} className="w-[100%]" variant={"outline"}>
                {t("CANCEL")}
              </Button>
              <Button disabled={!deleteButtonEnabled} onClick={() => props.onConfirm()} className="w-[100%]" variant={"destructive"}>
                {t("CONFIRM")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default AccountDeleteConfirmationDialog;
