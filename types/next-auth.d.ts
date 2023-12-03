import NextAuth from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string,
            workspacesId: string[],
            name: string,
            email: string,
            workspaces?: {
                id: string,
                creatorId: string,
                membersId: string[],
                name: string,
                description: string,
                inviteCode: string,
                boards: any[]
            }
        }
    }
}