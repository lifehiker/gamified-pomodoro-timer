import { SignInScreen } from "./SignInScreen";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl || "/dashboard";

  return <SignInScreen callbackUrl={callbackUrl} />;
}
