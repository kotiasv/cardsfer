// export type githubEmail = {
//     email: string
//     primary: boolean
//     verified: boolean
//     visibility: "private" | "public" | null
// }
// export type githubEmailRes = [] | githubEmail[] | null

export type User = {
    name: string
    email: string
    image: string
    workspaces: Workspace[] | []
}
export type Workspace = {
    name: string
    description: string
    inviteCode: string
    createdBy: User
    members: User[]
    boards: Board[] | []
}
export type Board = {
    name: string
    columns: {
        name: string
        cards: Card[] | []
    }[]
}
export type Card = {
    name: string
    priority: string
    description: string
    comments: Comment[] | []
}

export type Comment = {
    content: string
    author: User
    date: Date
}
