import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed', 'rejected'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  deadline: {
    type: Date
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  milestones: [{
    title: String,
    description: String,
    steps: [{
      title: String,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  feedback: [{
    message: String,
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  submittedAt: {
    type: Date
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);

