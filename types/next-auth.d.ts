import mongoose from "mongoose"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            workspaces: Workspace[] | [] | null | undefined
            id: mongoose.Schema.ObjectId | null | undefined
        } & DefaultSession["user"]
    }
}