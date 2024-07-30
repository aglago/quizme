import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLater: () => void;
  onPlayNow: () => void;
}

export const QuizActionDialog: React.FC<QuizActionDialogProps> = ({
  isOpen,
  onClose,
  onSaveLater,
  onPlayNow,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quiz Generated</AlertDialogTitle>
          <AlertDialogDescription>
            What would you like to do with the generated quiz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSaveLater}>
            Save to play later
          </AlertDialogCancel>
          <AlertDialogAction onClick={onPlayNow}>
            Play quiz now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
