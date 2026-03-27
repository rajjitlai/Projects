import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
};

export async function isAdmin(userId: string): Promise<boolean> {
  const adminId = process.env.ADMIN_GITHUB_ID;
  return adminId ? userId === adminId : false;
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      login: string;
      avatar_url?: string;
      email?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
