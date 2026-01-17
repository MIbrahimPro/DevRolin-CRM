import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        time: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            enum: ['onsite', 'remote'],
            default: 'remote'
        }
    },
    checkOut: {
        time: Date,
        location: {
            type: String,
            enum: ['onsite', 'remote']
        }
    },
    totalHours: {
        type: Number
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'leave'],
        default: 'present'
    }
}, {
    timestamps: true
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);

