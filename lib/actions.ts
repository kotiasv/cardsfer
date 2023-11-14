import mongoose, { Model } from "mongoose"
import { config } from "dotenv"
import { Entropy } from "entropy-string"
// import { action, connection, githubEmailRes } from "@/types"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import axios, { AxiosError } from "axios"
import { User, Workspace } from "@/schemas"
import { IUser } from "@/schemas/User"

config()

const {
    DB_URI: uri,
    NODE_ENV: nodeEnv
} = process.env

const connectionUri = `${uri}${nodeEnv === "production"
    ? "prod"
    : "dev"
    }?retryWrites=true&w=majority`

const dbConnect = async () =>
    await mongoose.connect(connectionUri)


// github email
const apiUrl = "https://api.github.com/user/public_emails"
export const getEmail = async (token: string) => {
    try {
        const res = await axios.get(apiUrl, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        })
        const emails: githubEmailRes = await res.data

        if (!emails || emails.length === 0)
            return null

        return emails
            .find(email => email.primary)?.email
            || emails[0].email
    } catch (error) {
        error instanceof AxiosError
            ? console.log(error.message)
            : console.log("Error while fetching data")

        return null
    }
}

// user
export const createUser = async (data: {
    name: string
    email: string
    image: string
}) => {
    await dbConnect()
    const user = new User(data)
    await user.save()

    return user.toJSON()
}

export const getUser = async (data: {
    email: string
}) => {
    await dbConnect()
    const user = await User.findOne({
        email: data.email
    }).populate("workspaces")
    
    return user ? user.toJSON() : null
}

export const changeUser = async (data: {
    id: mongoose.Types.ObjectId
    newName: string
}) => {
    await dbConnect()

    const { id, newName } = data
    const user = await User.findByIdAndUpdate(id, {
        name: newName
    })
    return user.toJSON()
}

// workspace
export const createWorkspace = async (data: {
    userId: mongoose.Types.ObjectId
    name: string
    description: string
}) => {
    await dbConnect()
    const { userId, name, description } = data
    const entropy = new Entropy({ total: 1e6, risk: 1e9 })
    const inviteCode = entropy.string()

    const workspace = new Workspace({
        name,
        description,
        inviteCode,
        createdBy: userId,
        members: [userId]
    })
    await workspace
        .save()
        .populate("createdBy")
        .populate("members")

    const user = await User.findById(userId)
    const workspaces = user.workspaces
    await User.findByIdAndUpdate(userId, {
        workspaces: [...workspaces, workspace._id]
    })

    return workspace.toJSON()
}

export const getWorkspace = async (data: {
    workspaceId: mongoose.Types.ObjectId
}) => {
    await dbConnect()
    
    const workspace = await Workspace
        .findById(data.workspaceId)
        .populate("createdBy")
        .populate("members")
    return workspace ? workspace.toJSON() : null
}

export const quitWorkspace = async (data: {
    userId: mongoose.Types.ObjectId,
    workspaceId: mongoose.Types.ObjectId
}) => {
    const { userId, workspaceId } = data
    const user = await User.findById(userId)

    if (!user.workspaces.find(id => workspaceId.equals(id)))
        return "Not in the workspace"

    const workspace = await Workspace.findById(workspaceId)

    await User.findByIdAndUpdate(userId, {
        workspaces: [...user.workspaces.filter(id => !workspaceId.equals(id))]
    })
    await Workspace.findByIdAndUpdate(workspaceId, {
        members: [...workspace.members.filter(id => !userId.equals(id))]
    })

    return "Done"
}

// session
export const getSession = async () =>
    await getServerSession(authOptions)