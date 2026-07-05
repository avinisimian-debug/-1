import { get } from "@vercel/blob";
import { BadRequestError } from "@/shared/api";

export async function fileFromBlobUrl(
  blobUrl: string,
  fileName: string,
  contentType: string,
): Promise<File> {
  const result = await get(blobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new BadRequestError(
      "Uploaded file not found or expired. Please upload again.",
    );
  }

  const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
  if (buffer.length === 0) {
    throw new BadRequestError("Uploaded file is empty.");
  }

  return new File([new Uint8Array(buffer)], fileName, {
    type: contentType || "application/octet-stream",
  });
}

export function assertBlobPathForUser(pathname: string, email: string): void {
  const prefix = `transcribe/${email.toLowerCase()}/`;
  if (!pathname.startsWith(prefix)) {
    throw new BadRequestError("Invalid upload reference.");
  }
}

export function buildTranscribeBlobPath(email: string, fileName: string): string {
  const safeName = fileName.replace(/[^\w.\-() ]+/g, "_").slice(0, 180);
  return `transcribe/${email.toLowerCase()}/${Date.now()}-${safeName}`;
}
