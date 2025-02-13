"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";

import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

const SignOutBtn = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logOut();
        });
      }}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Sign Out
    </Button>
  );
};

export default SignOutBtn;
