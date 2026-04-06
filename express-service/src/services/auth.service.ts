import z from "zod";
import { loginSchema } from "../validations";
export class AuthService {
  login = (data: z.infer<typeof loginSchema>) => {};
}
