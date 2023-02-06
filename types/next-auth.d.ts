import { UserSession } from "./interfaces";

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }
}
