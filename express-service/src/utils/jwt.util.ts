import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

/**
 * Verifies a JSON Web Token against a given secret.
 * Throws an error if the token is invalid, tampered with, or expired.
 */
export const verifyJwtToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

/**
 * Creates and signs a new JSON Web Token.
 * Bundles the user's ID and role securely within the token payload.
 */
export const createJwtToken = (
  userId: string,
  role: string,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ userId, role }, secret, options);
};
