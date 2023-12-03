import prisma from "@/lib/prisma"

const getUsers = async (_req: Request, { params }: {
    params: {
        id: string
    }
}) => {
    const { id } = params

    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                workspaces: true
            }
        })

        return Response.json(user)
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
    getUsers as GET
}