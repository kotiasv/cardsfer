import { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import prisma from "./prisma"

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
        session: async ({ session, token }) => {
            console.log(token.user)
            return session
        },

        jwt: async ({ token, account }) => {
            if (account) {
                const {
                    name,
                    email,
                    picture: image
                } = token

                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: email as string
                    }
                })

                console.log("GET", dbUser)

                if (dbUser) {
                    token.user = dbUser
                    return token
                }

                const user = await prisma.user.create({
                    data: {
                        name: name as string,
                        email: email as string,
                        image: image as string
                    }
                })

                console.log("POST", user)

                token.user = user
            }
            return token
        }
        // redirect: async ({ url, baseUrl }) => {
        //     return `${baseUrl}/app`
        // }
    }
}