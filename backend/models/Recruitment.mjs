import mongoose from 'mongoose';

const recruitmentSchema = new mongoose.Schema({
    request: {
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        department: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        reason: String,
        urgency: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    jobPosting: {
        title: String,
        description: String,
        requirements: [String],
        postedOn: {
            type: String,
            enum: ['crm', 'linkedin', 'both'],
            default: 'crm'
        },
        linkedinUrl: String,
        status: {
            type: String,
            enum: ['draft', 'published', 'closed'],
            default: 'draft'
        }
    },
    candidates: [{
        name: String,
        email: String,
        phone: String,
        cv: {
            url: String,
            name: String
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'interviewed', 'selected', 'rejected'],
            default: 'applied'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],
    meetings: [{
        candidate: mongoose.Schema.Types.ObjectId,
        scheduledAt: Date,
        jitsiRoomId: String,
        recordingUrl: String,
        notes: String,
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled'
        }
    }],
    selectedCandidate: {
        type: mongoose.Schema.Types.ObjectId
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    offerLetter: {
        url: String,
        generatedAt: Date
    },
    hired: {
        type: Boolean,
        default: false
    },
    hiredAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Recruitment', recruitmentSchema);


