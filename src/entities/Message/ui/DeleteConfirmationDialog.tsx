import { useTranslation } from "@/shared/lib";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui";

interface DeleteConfirmationDialogProps {
  isShown: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationDialog(props: DeleteConfirmationDialogProps) {
  const t = useTranslation();

  return (
    <Dialog open={props.isShown} onOpenChange={props.onCancel}>
      <DialogContent>
        {props.isShown && (
          <>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("ARE_YOU_SURE")}</CardTitle>
                <CardDescription>{t("YOU_ARE_ABOUT_TO_DELETE_MESSAGE")}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-[15px]">
                  {t("IT_WILL_CAUSE_MESSAGE_TO_DISAPPEAR")}
                  <br />
                  {t("THIS_ACTION_CANT_BE_UNDONE")}
                </span>
                <div className="pt-2 flex flex-row gap-2">
                  <Button onClick={() => props.onCancel()} className="w-[100%]" variant={"outline"}>
                    {t("CANCEL")}
                  </Button>
                  <Button onClick={() => props.onConfirm()} className="w-[100%]" variant={"destructive"}>
                    {t("CONFIRM")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
