import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export const getSession = async () =>
    await getServerSession(authOptions)

const randPart = () =>
    Math
        .random()
        .toString(36)
        .substring(2)

export const generateInviteCode = () =>
    randPart() + randPart()
