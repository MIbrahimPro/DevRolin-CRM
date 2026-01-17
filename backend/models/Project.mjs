import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'on-hold', 'completed', 'cancelled'],
        default: 'pending'
    },
    pm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    budget: {
        type: Number
    },
    timeline: {
        startDate: Date,
        endDate: Date
    },
    requirements: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Project', projectSchema);

