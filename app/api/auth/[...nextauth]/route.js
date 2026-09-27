import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Citizen Account",
      credentials: {
        identifier: { label: "Email or Mobile", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Full Name", type: "text" },
        locality: { label: "Locality", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        const raw = credentials.identifier.trim()
        const isEmail = raw.includes('@')
        const name = credentials.name || (isEmail ? raw.split('@')[0] : `Citizen ${raw.slice(-4)}`)
        const email = isEmail ? raw : `${raw}@citizen.jss.gov.in`

        return {
          id: "JSS-CIT-" + Math.floor(10000 + Math.random() * 90000),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "mock_github_id",
      clientSecret: process.env.GITHUB_SECRET || "mock_github_secret",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || token.sub
        session.user.name = token.name || session.user.name
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "jan-samadhaan-setu-sih-2026-secret",
})

export { handler as GET, handler as POST }