import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Stakeholder Account",
      credentials: {
        identifier: { label: "Email or Mobile", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Full Name", type: "text" },
        role: { label: "Role", type: "text" },
        organization: { label: "Organization", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        const raw = credentials.identifier.trim()
        const isEmail = raw.includes('@')
        const role = credentials.role || 'citizen'
        const rolePrefix = role === 'student' ? 'STU' : role === 'faculty' ? 'FAC' : role === 'university' ? 'UNI' : role === 'government' ? 'GOV' : role === 'company' ? 'CORP' : 'CIT'
        const name = credentials.name || (isEmail ? raw.split('@')[0] : `${role.toUpperCase()} User`)
        const email = isEmail ? raw : `${raw}@${role}.jss.gov.in`

        return {
          id: `JSS-${rolePrefix}-${Math.floor(10000 + Math.random() * 90000)}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email,
          role: role
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
        token.role = user.role || 'citizen'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || token.sub
        session.user.name = token.name || session.user.name
        session.user.role = token.role || 'citizen'
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "jan-samadhaan-setu-sih-2026-secret",
})

export { handler as GET, handler as POST }