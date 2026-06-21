import { auth } from "@/auth";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { JsonLd } from "@/components/seo/JsonLd";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    return <DashboardContent />;
  }

  return (
    <>
      <JsonLd />
      <LoginScreen />
    </>
  );
}
