import mongoose from "mongoose"

export interface IUser {
    name: string
    email: string
    image: string
    workspaces: [] | mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<IUser>({
    name: String,
    email: String,
    image: String,
    workspaces: [
        {
            ref: "Workspace",
            type: mongoose.Schema.ObjectId
        }
    ]
}, {
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})
export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)