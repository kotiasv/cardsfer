import { User } from "@/types"
import axios, { AxiosError } from "axios"
import { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { createUser, getEmail, getUser } from "./actions"

const {
    GITHUB_ID: githubId,
    GITHUB_SECRET: githubSecret
} = process.env


export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: githubId as string,
            clientSecret: githubSecret as string
        })
    ],
    callbacks: {
        session: async ({ session }) => {
            const { name, email, image } = session.user
            const dbUser: User = await getUser({
                email: email as string
            })
            if (dbUser)
                return {
                    ...session,
                    user: dbUser
                }

            const user = await createUser({
                name: name as string,
                email: email as string,
                image: image as string
            })
            return {
                ...session,
                user
            }
        },
        signIn: async ({ account, user }) => {
            // get email for github provider
            // if (account?.provider === "github") {
            //     if (account?.provider === "github") {
            //         const email = await getEmail(account.access_token as string)
            //         if (!email)
            //             return false

            //         user.email = email

            //     }
            // }

            return true
        },
        redirect: async ({ url, baseUrl }) => {
            return `${baseUrl}/app`
        }
    }
}