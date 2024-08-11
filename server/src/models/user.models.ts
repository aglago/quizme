import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "Prefer not to say"],
    },
    profilePicture: {
      type: String,
      required: true
    },
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
