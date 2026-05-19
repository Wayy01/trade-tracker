import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignUpPage() {
  return (
    <main className="flex h-[100dvh] w-full items-center justify-center px-6 safe-pt safe-pb">
      <SignInForm mode="signUp" />
    </main>
  );
}
