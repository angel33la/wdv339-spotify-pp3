import Playlist from "../models/Playlist.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const playlist = await Playlist.create({
      name: name.trim(),
      user: req.user._id,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error("Create playlist error:", error.message);
    res.status(500).json({ message: "Failed to create playlist" });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(playlists);
  } catch (error) {
    console.error("Get playlists error:", error.message);
    res.status(500).json({ message: "Failed to fetch playlists" });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Get playlist error:", error.message);
    res.status(500).json({ message: "Failed to fetch playlist" });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { videoId, title, channelTitle, thumbnail } = req.body;

    if (!videoId || !title) {
      return res
        .status(400)
        .json({ message: "videoId and title are required" });
    }

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const alreadyExists = playlist.songs.some(
      (song) => song.videoId === videoId,
    );

    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Song already exists in playlist" });
    }

    playlist.songs.push({
      videoId,
      title,
      channelTitle,
      thumbnail,
    });

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Add song error:", error.message);
    res.status(500).json({ message: "Failed to add song to playlist" });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.params;

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.songs = playlist.songs.filter((song) => song.videoId !== songId);

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Remove song error:", error.message);
    res.status(500).json({ message: "Failed to remove song from playlist" });
  }
};

export const updatePlaylistName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.name = name.trim();
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Update playlist name error:", error.message);
    res.status(500).json({ message: "Failed to update playlist name" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    console.error("Delete playlist error:", error.message);
    res.status(500).json({ message: "Failed to delete playlist" });
  }
};
