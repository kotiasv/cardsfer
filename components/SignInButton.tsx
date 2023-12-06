"use client"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

const SignInButton = () => {
    const [hover, setHover] = useState(false)

    return <button
        onClick={() => signIn("github")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}

        className={`flex gap-3 items-center transition-colors ${hover
            ? "bg-[#41895F] text-white"
            : "text-black bg-white"
            } py-3 rounded-xl px-5 mx-auto`}
    >
        <Image
            src="/github.svg"
            alt="github"
            className={hover ? "github" : ""}
            width={28}
            height={28}
        />
        Continue with GitHub
    </button>
}

export default SignInButton