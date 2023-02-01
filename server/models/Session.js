import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema(
  {
    game_id: {
      type: String,
      required: true,
    },
    player_id: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 5000,
    },
    demo: {
      type: Boolean,
      default: false,
    },
    // session,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Session', SessionSchema);
