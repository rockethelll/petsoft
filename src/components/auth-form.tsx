"use client";

import { useActionState } from "react";

import AuthFormBtn from "./auth-form-btn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { logIn, signUp } from "@/actions/actions";

type AuthFormProps = {
  type: "logIn" | "signUp";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const [signUpError, dispatchSignUp] = useActionState(signUp, undefined);
  const [logInError, dispatchLogIn] = useActionState(logIn, undefined);

  return (
    <form action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          defaultValue="example@gmail.com"
        />
      </div>
      <div className="mt-2 mb-4 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          defaultValue="example"
        />
      </div>

      <AuthFormBtn type={type} />

      {signUpError && (
        <p className="text-red-500 text-sm mt-2">{signUpError.message}</p>
      )}
      {logInError && (
        <p className="text-red-500 text-sm mt-2">{logInError.message}</p>
      )}
    </form>
  );
};

export default AuthForm;
