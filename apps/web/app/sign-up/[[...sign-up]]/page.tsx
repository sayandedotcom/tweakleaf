import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-6 md:p-10 h-screen">
      <SignUp />
    </div>
  );
}
