import prisma from "@/lib/prisma"
import { Workspace } from "@prisma/client"

const getWorkspace = async (_req: Request, { params }: {
    params: {
        id: string
    }
}) => {
    const { id } = params

    try {
        const workspace = await prisma.workspace.findUnique({
            where: {
                id
            },
            include: {
                members: true,
                boards: true
            }
        })

        return Response.json(workspace)
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

const deleteWorkspace = async (workspace: Workspace) => {
    const usersId = workspace.membersId
    await prisma.workspace.delete({
        where: {
            id: workspace.id
        }
    })

    usersId.forEach(async userId => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user)
            return

        const workspacesId = user.workspacesId.filter(id => id !== workspace.id)
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                workspacesId
            }
        })
    })
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

        action === "quit"
            ? await quitWorkspace(workspace, userId)
            : await deleteWorkspace(workspace)

        return new Response(null, {
            status: 204
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

const joinWorkspace = async (req: Request, { params }: {
    params: {
        id: string
    }
}) => {
    const { id } = params

    try {
        const {
            userId
        } = await req.json() as {
            userId: string
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user)
            return Response.json({
                name: "NotFoundError",
                message: "User is not found"
            }, {
                status: 404
            })

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

        const isMember = workspace.membersId.find(id => id === userId)
        if (isMember)
            return Response.json({
                name: "MatchedIdsError",
                message: "User is already in workspace"
            }, {
                status: 400
            })

        await prisma.workspace.update({
            where: {
                id
            },
            data: {
                membersId: [
                    ...workspace.membersId,
                    userId
                ]
            }
        })
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                workspacesId: [
                    ...user.workspacesId,
                    id
                ]
            }
        })

        return new Response(null, {
            status: 204
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
    getWorkspace as GET,
    joinWorkspace as POST,
    removeWorkspace as DELETE
}