import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        attachments: [{
            name: String,
            url: String,
            type: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
}, {
    timestamps: true
});

export default mongoose.model('Chat', chatSchema);

