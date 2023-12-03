import { generateInviteCode } from "@/lib/actions"
import prisma from "@/lib/prisma"

const createWorkspace = async (req: Request) => {
    try {
        const {
            creatorId,
            name,
            description
        } = await req.json() as {
            creatorId: string,
            name: string,
            description: string
        }

        const inviteCode = generateInviteCode()

        const workspace = await prisma.workspace.create({
            data: {
                creatorId,
                name,
                description,
                inviteCode,
                membersId: [creatorId]
            },
            include: {
                members: true
            }
        })

        const user = await prisma.user.findUnique({
            where: {
                id: creatorId
            }
        })
        await prisma.user.update({
            where: {
                id: creatorId
            },
            data: {
                workspacesId: [
                    ...user?.workspacesId as string[],
                    workspace.id
                ]
            }
        })

        return Response.json(workspace, {
            status: 201
        })
    } catch (Err) {
        const { name, message } = Err as Error
        return Response.json({
            name,
            message
        }, {
            status: 400
        })
    }
}

export {
    createWorkspace as POST
}