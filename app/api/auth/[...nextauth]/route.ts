import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const AUTHORIZED_EMAILS = ['alysson@arcom.com.br', 'cleber@arcom.com.br'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (user?.email && AUTHORIZED_EMAILS.includes(user.email)) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Se a URL é um caminho relativo, use o baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Se a URL é do mesmo domínio, use como está
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Caso contrário, redirecione para a página inicial
      return baseUrl;
    },
    async session({ session }: { session: any }) {
      return session;
    },
    async jwt({ token }: { token: any }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
