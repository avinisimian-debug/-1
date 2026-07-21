import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { buildPrivatePageMetadata } from "@/lib/seo";

export const metadata = buildPrivatePageMetadata(
  "Settings",
  "Manage your Staz AI plan, billing, and integrations.",
);

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  return children;
}
