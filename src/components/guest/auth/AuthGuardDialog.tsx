"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionName?: string;
}

export function AuthGuardDialog({
  isOpen,
  onClose,
  title = "Sign in to continue",
  description = "You need to be signed in to perform this action. Your progress will be saved.",
  actionName = "continue",
}: AuthGuardDialogProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignIn = () => {
    onClose();
    const loginUrl = new URL("/login", window.location.origin);
    loginUrl.searchParams.set("redirect", pathname);
    router.push(loginUrl.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSignIn} className="w-full sm:w-auto">
            Sign in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
