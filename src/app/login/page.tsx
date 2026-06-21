import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { JsonLd } from "@/components/seo/JsonLd";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <JsonLd />
      <LoginScreen />
    </>
  );
}
