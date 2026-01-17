import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // BlockNote content format
        default: {}
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    sharedWith: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        mode: {
            type: String,
            enum: ['live', 'static'],
            default: 'static'
        },
        version: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DocumentVersion'
        },
        sharedAt: {
            type: Date,
            default: Date.now
        }
    }],
    versions: [{
        content: mongoose.Schema.Types.Mixed,
        versionNumber: Number,
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }],
    isLiveShared: {
        type: Boolean,
        default: false
    },
    liveEditors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Document', documentSchema);

