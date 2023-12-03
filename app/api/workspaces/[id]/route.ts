import prisma from "@/lib/prisma"
import { Workspace } from "@prisma/client"

const quitWorkspace = async (workspace: Workspace, userId: string) => {

    // todo: test it

    await prisma.workspace.update({
        where: {
            id: workspace.id
        },
        data: {
            membersId: workspace.membersId.filter(id => id !== userId)
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            workspacesId: user?.workspacesId.filter(id => id !== workspace.id)
        }
    })
}

const deleteWorkspace = async () => {
    // todo
}

const removeWorkspace = async (req: Request, { params }: {
    params: {
        id: string
    }
}) => {
    const { id } = params

    try {
        const {
            userId,
            action
        } = await req.json() as {
            userId: string,
            action: "delete" | "quit"
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                id
            }
        })

        if (!workspace)
            return Response.json({
                name: "NotFoundError",
                message: "Workspace is not found"
            }, {
                status: 404
            })


        if (workspace?.creatorId !== userId && action === "delete")
            return Response.json({
                name: "PermissionError",
                message: "Method not allowed"
            }, {
                status: 405
            })

        action === "quit" && workspace.membersId.length > 1
            ? await quitWorkspace(workspace, userId)
            : await deleteWorkspace()

        return new Response(null, {
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

const joinWorkspace = async () => {
    // todo
}

export {
    removeWorkspace as DELETE
}