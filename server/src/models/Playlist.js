import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    channelTitle: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [songSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Playlist", playlistSchema);
