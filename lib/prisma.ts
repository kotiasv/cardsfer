import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: ReturnType<typeof createClient>
}

const createClient = () => new PrismaClient()
const prisma = globalThis.prisma ?? createClient()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma