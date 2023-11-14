import { changeUser, createWorkspace, getSession, getWorkspace, quitWorkspace } from "@/lib/actions"

const App = async () => {
    const session = await getSession()
    // const workspace = await createWorkspace({
    //     userId: session?.user.id,
    //     name: "workspace1",
    //     description: "test desc"
    // })
    // console.log(workspace)
    // console.log(session?.user)
    const workspace = await quitWorkspace({
        userId: session.user.id,
        workspaceId: session?.user.workspaces[0].id
    })
    console.log(workspace)
    return (
        <div>
            Name: {session?.user?.name || "null"}
        </div>
    )
}

export default App