// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { User } from "next-auth";

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;
    hasAccess: boolean;
  }
}
