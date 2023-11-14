"use client"
import { signIn, signOut } from "next-auth/react"

const Auth = () => {
    return (
        <div>
            <button onClick={() => signIn("github")}>Sign in</button>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    )
}

export default Auth