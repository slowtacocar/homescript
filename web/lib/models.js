import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
  global: {
    lifx: {
      apiKey: String,
    },
    time: {
      lat: Number,
      long: Number,
    },
  },
});

const scriptSchema = new mongoose.Schema({
  userId: String,
  description: String,
  name: String,
  script: String,
  trigger: {
    name: String,
    params: Map,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Script =
  mongoose.models.Script || mongoose.model("Script", scriptSchema);
