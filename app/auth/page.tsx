import SignInButton from "@/components/SignInButton"
import { authContent } from "@/constants"
import Image from "next/image"

const Auth = () => {
    return (
        <div className="screen absolute">
            <div className="auth-gradient screen fixed -z-10" />
            <main className="max-w-[1200px] screen flex justify-center mx-auto">
                <div className="flex flex-col-reverse auth:flex-row w-full justify-around self-center items-center pb-24 auth:pb-0">
                    <section className="mt-40 pl-3 sm:pl-0 auth:mt-0">
                        <h1 className="inline-flex gap-3 mx-auto items-center text-4xl font-bold">
                            <Image
                                src="/logo.svg"
                                alt="logo"
                                width={45}
                                height={51}
                            />
                            Cardsfer
                        </h1>
                        <ul className="mt-5 sm:ml-4">
                            {authContent.map(({ title, content }, index) => <li
                                key={`content-${index}`}
                            >
                                <h3 className="text-2xl sm:text-3xl font-bold mt-8">
                                    {title}
                                </h3>
                                <p className="sm:text-lg max-w-[300px] leading-6 text-[#bababa] sm:max-w-[448px] mt-1 sm:mt-3">
                                    {content}
                                </p>
                            </li>)}
                        </ul>
                    </section>
                    <section className="mt-[400px] auth:mt-0">
                        <h2 className="text-3xl font-bold">
                            Sign In to Cardsfer
                        </h2>
                        <div className="mt-3 mb-6">
                            <div className="dots" />
                            <div className="dots mt-2" />
                            <div className="dots mt-2" />
                        </div>
                        <SignInButton />
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Auth