import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    answeredAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'answered'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('Question', questionSchema);


