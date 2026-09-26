import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata = {
  title: "Submit a Problem Statement | Jan Samadhaan Setu",
  description: "Register a civic or societal problem statement for solver teams and innovators across India.",
}

export default function SubmitProblemLayout({ children }) {
  return (
    <div className={`${roboto.variable} ${roboto.className} font-roboto font-['Roboto',sans-serif]`}>
      {children}
    </div>
  )
}
