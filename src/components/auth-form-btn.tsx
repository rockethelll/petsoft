"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "./ui/button";

type AuthFormBtnProps = {
  type: "logIn" | "signUp";
};

const AuthFormBtn = ({ type }: AuthFormBtnProps) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      {type === "logIn" ? "Log In" : "Sign Up"}
    </Button>
  );
};

export default AuthFormBtn;
