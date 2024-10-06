import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/Card";
import { DialogDescription } from "@radix-ui/react-dialog";

interface DeleteConfirmationDialogProps {
  isShown: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationDialog(props: DeleteConfirmationDialogProps) {
  return (
    <Dialog
        open={props.isShown}
        onOpenChange={props.onCancel}>
        <DialogContent>
          {props.isShown && <>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Are you sure?</CardTitle>
                <CardDescription>
                  You are about to delete the message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-[15px]">
                  It will cause the message to disappear.
                  <br />
                  This action can’t be undone.
                </span>
                <div className="pt-2 flex flex-row gap-2">
                  <Button onClick={() => props.onCancel()} className="w-[100%]" variant={"outline"}>Cancel</Button>
                  <Button onClick={() => props.onConfirm()} className="w-[100%]" variant={"destructive"}>Confirm</Button>
                </div>
              </CardContent>
            </Card>
          </>}
        </DialogContent>
      </Dialog>
  )
}

export default DeleteConfirmationDialog