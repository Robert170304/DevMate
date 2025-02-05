import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            // Store access token if available (OAuth providers)
            if (account) {
                token.accessToken = account.access_token; // Add access token
            }
            return token;
        },
        async session({ session, token }) {
            session.user = { ...session.user, id: token.id as string };
            // Attach access token to session
            session = { ...session, accessToken: token.accessToken } as SessionResponse;
            return session;
        },
    },
};

export { options as authConfig };

const authHandler = NextAuth(options); // Correct instantiation

export default authHandler;
