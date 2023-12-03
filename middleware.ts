import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"


const protectedApiRoutes = ["/api/workspaces"]

export const middleware = async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.SECRET })
    const isAuthorized = !!token

    const path = req.nextUrl.pathname
    // if (protectedApiRoutes.includes(path) && !isAuthorized)
    //     return NextResponse.json({
    //         message: "Not Authorized"
    //     }, {
    //         status: 401
    //     })

    console.log(isAuthorized, req.nextUrl.pathname)
}