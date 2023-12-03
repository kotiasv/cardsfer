import { getSession } from "@/lib/actions"

const App = async () => {
    const session = await getSession()
    console.log(session)

    return (
        <div>
            session:

        </div>
    )
}

export default App