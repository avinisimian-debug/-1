import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { buildPrivatePageMetadata } from "@/lib/seo";

export const metadata = buildPrivatePageMetadata(
  "History",
  "Your transcription history on Staz AI.",
);

export default async function HistoryLayout({
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
