const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      weight: { type: Number, required: true },
      category: { type: String, enum: ['strength', 'cardio','yoga','pilates','crossfit'], required: true },
      notes: { type: String }
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);
