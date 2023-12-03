import prisma from "@/lib/prisma"

const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            include: {
                workspaces: true
            }
        })

        return Response.json(users)
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