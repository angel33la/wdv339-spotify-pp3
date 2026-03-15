import { Song } from "../models/Search.js";
import { Album } from "../models/Playlist.js";


export const getAllPlaylists = async (req, res, next) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await new Promise((resolve, reject) => {
      Album.findById(playlistId, (err, album) => {
        if (err) reject(err);
        else resolve(album);
      });
    });


    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json({ ...playlist.toObject(), songs });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;

    const playlist = new Playlist({
      title,
      artist,
      imageUrl,
      releaseYear,
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
    const { id } = req.params;

    const playlist = await playlist.findById(id);

    // if playlist belongs to an album, update the album's playlists array
    if (playlist.albumId) {
      await Album.findByIdAndUpdate(playlist.albumId, {
        $pull: { playlists: playlist._id },
      });
    }

    await playlist.findByIdAndDelete(id);

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.log("Error in deletePlaylist", error);
    next(error);
  }
};

