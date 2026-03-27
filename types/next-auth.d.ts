import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      login: string;
      avatar_url?: string;
      email?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    login: string;
    avatar_url?: string;
    email?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
