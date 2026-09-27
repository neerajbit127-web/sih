import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata = {
  title: "Submit a Problem | Jan Samadhaan Setu",
  description: "Report a public or community problem for automated routing and transparent resolution.",
}

export default function SubmitProblemLayout({ children }) {
  return (
    <div className={`${roboto.variable} ${roboto.className} font-roboto font-['Roboto',sans-serif]`}>
      {children}
    </div>
  )
}
