import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ACCEPTED_FILE_TYPES, PLAN_LIMITS } from "@/lib/constants";
import { assertBlobPathForUser } from "@/lib/blob-file";
import { syncUserPlanOnAccess } from "@/lib/users-store";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Large file uploads are not configured on the server." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;
  const email = session.user.email.toLowerCase();
  const plan = await syncUserPlanOnAccess(email, session.user.name ?? undefined);
  const maxBytes = PLAN_LIMITS[plan].maxFileSizeBytes;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        assertBlobPathForUser(pathname, email);

        return {
          allowedContentTypes: ACCEPTED_FILE_TYPES,
          maximumSizeInBytes: maxBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ email }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[transcribe-upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
