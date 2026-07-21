import { buildPrivatePageMetadata } from "@/lib/seo";

export const metadata = buildPrivatePageMetadata(
  "Admin",
  "Staz AI admin tools.",
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
