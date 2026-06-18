import { OAuth2Client } from "google-auth-library";
import { resolveGoogleClientId } from "@/lib/auth-oauth";

export interface VerifiedGoogleUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export async function verifyGoogleIdToken(
  credential: string,
): Promise<VerifiedGoogleUser | null> {
  const clientId = await resolveGoogleClientId();
  if (!clientId) return null;

  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.sub) return null;

    return {
      id: payload.sub,
      name: payload.name ?? payload.email.split("@")[0] ?? "User",
      email: payload.email.toLowerCase(),
      image: payload.picture,
    };
  } catch {
    return null;
  }
}
