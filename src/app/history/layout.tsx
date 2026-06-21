import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { privatePageRobots } from "@/lib/seo";

export const metadata = privatePageRobots;

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
