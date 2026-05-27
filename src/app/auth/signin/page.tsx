"use client";
import { useSearchParams } from "next/navigation";
import { SignInScreen } from "./SignInScreen";

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  return <SignInScreen callbackUrl={callbackUrl} />;
}
