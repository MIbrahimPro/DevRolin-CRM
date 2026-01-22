import mongoose from 'mongoose';

const chatAttachmentSchema = new mongoose.Schema(
    {
        name: { type: String },
        url: { type: String },
        type: { type: String }
    },
    { _id: false }
);

const chatMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        attachments: {
            type: [chatAttachmentSchema],
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const chatSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    messages: {
        type: [chatMessageSchema],
        default: []
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
}, {
    timestamps: true
});

export default mongoose.model('Chat', chatSchema);


