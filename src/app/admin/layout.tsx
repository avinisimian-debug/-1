import { privatePageRobots } from "@/lib/seo";

export const metadata = privatePageRobots;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
