import { Song } from "../models/Search.js";
import { Album } from "../models/Playlist.js";

export const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await Album.find().sort({ createdAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Album.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const songs = await Song.find({ albumId: playlistId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ ...playlist.toObject(), songs });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { title, artist, releaseYear, coverUrl } = req.body;

    const playlist = new Album({
      title,
      artist,
      releaseDate: releaseYear,
      coverUrl,
    });

    await playlist.save();

    res.status(201).json(playlist);
  } catch (error) {
    console.log("Error in createPlaylist", error);
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId, id } = req.params;
    const targetId = playlistId || id;

    const playlist = await Album.findById(targetId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Remove songs associated with this playlist/album id before deleting playlist.
    await Song.deleteMany({ albumId: targetId });
    await Album.findByIdAndDelete(targetId);

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.log("Error in deletePlaylist", error);
    next(error);
  }
};
