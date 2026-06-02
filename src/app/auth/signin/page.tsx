"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignInScreen } from "./SignInScreen";

function SignInPageInner() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  return <SignInScreen callbackUrl={callbackUrl} />;
}

export default function SignInPage() {
  // useSearchParams() triggers a CSR bailout; without a Suspense boundary it
  // errors during static prerender (`next build` with output: standalone).
  return (
    <Suspense fallback={<SignInScreen callbackUrl="/dashboard" />}>
      <SignInPageInner />
    </Suspense>
  );
}
