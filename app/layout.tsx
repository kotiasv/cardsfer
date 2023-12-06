import AuthProvider from "@/components/AuthProvider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app"
}

const RootLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <html lang="en" className="screen">
            <body className={`bg-black text-white screen ${inter.className}`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}

export default RootLayout