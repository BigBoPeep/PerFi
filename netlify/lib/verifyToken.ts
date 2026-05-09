import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getSigningKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) return reject(err);
      resolve(key!.getPublicKey());
    });
  });
}

export interface AuthPayload extends JwtPayload {
  sub: string;
}

export const verifyToken = async (
  authHeader: string | undefined,
): Promise<AuthPayload> => {
  if (!authHeader?.startsWith("Bearer "))
    throw new Error("Missing or malformed Authorization header");

  const token = authHeader.split(" ")[1];

  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || typeof decoded === "string" || !decoded.header.kid)
    throw new Error("Invalid token structure");

  const signingKey = await getSigningKey(decoded.header.kid);

  const payload = jwt.verify(token, signingKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
  }) as AuthPayload;

  return payload;
};
