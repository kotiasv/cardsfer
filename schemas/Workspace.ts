import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema({
    name: String,
    description: String,
    inviteCode: String,
    createdBy: {
        ref: "User",
        type: mongoose.Schema.ObjectId
    },
    members: [
        {
            ref: "User",
            type: mongoose.Schema.ObjectId
        }
    ],
    boards: [
        {
            ref: "Board",
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
export const Workspace = mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema)