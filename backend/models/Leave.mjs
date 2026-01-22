import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    type: {
        type: String,
        enum: ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'emergency'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    rejectionReason: {
        type: String
    },
    reviewedAt: {
        type: Date
    },
    days: {
        type: Number,
        required: true
    },
    flagged: {
        type: Boolean,
        default: false
    },
    flagReason: {
        type: String
    },
    flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, {
    timestamps: true
});

export default mongoose.model('Leave', leaveSchema);


