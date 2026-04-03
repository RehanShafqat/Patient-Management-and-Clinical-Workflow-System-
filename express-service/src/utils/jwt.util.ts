import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const verifyJwtToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const createJwtToken = (
  userId: string,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ userId }, secret, options);
};
