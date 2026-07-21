import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { buildPrivatePageMetadata } from "@/lib/seo";

export const metadata = buildPrivatePageMetadata(
  "Live lectures",
  "Schedule and join Zoom / Google Meet live lectures on Staz AI.",
);

export default async function LiveLayout({
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
