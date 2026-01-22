import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        unique: true,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract'],
        default: 'full-time'
    },
    workMode: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        default: 'remote'
    },
    documents: [{
        name: String,
        type: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    leaveBalance: {
        type: Number,
        default: 20
    },
    salary: {
        type: Number
    },
    performance: [{
        reviewPeriod: String,
        rating: Number,
        feedback: String,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        reviewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    terminated: {
        type: Boolean,
        default: false
    },
    terminationDate: {
        type: Date
    },
    terminationReason: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Employee', employeeSchema);


