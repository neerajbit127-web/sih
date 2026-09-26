import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata = {
  title: "Browse Challenges | Jan Samadhaan Setu",
  description: "Discover community-driven problem statements across civic infrastructure, healthcare, education, agriculture, and sustainability. Propose innovative solutions or collaborate with changemakers.",
}

export default function ChallengesLayout({ children }) {
  return (
    <div className={`${roboto.variable} ${roboto.className} font-roboto font-['Roboto',sans-serif]`}>
      {children}
    </div>
  )
}
