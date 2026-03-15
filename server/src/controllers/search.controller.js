import { Song } from "../models/Search.js";

const allSongs = async (req, res, next) => {
  try {
    // -1 = Descending => newest -> oldest
    // 1 = Ascending => oldest -> newest
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

const getSong = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          // Case-insensitive search for title
          { title: { $regex: search, $options: "i" } },
          // Case-insensitive search for artist
          { artist: { $regex: search, $options: "i" } },
          // Case-insensitive search for genre
          { genre: { $regex: search, $options: "i" } },
        ],
      };
    }
    const songs = await Song.find(query);
    res.json(songs);
  } catch (error) {
    next(error);
    res.status(500).json({ error: error.message });
  }
};

const createSong = async (req, res, next) => {
  try {
    const { title, artist, genre, releaseDate, songUrl } = req.body;
    const newSong = new Song({
      title,
      artist,
      genre,
      releaseDate,
      songUrl,
    });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    next(error);
  }
};

// Edit song endpoint
const editSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, genre, releaseDate, songUrl } = req.body;
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      {
        title,
        artist,
        genre,
        releaseDate,
        songUrl,
      },
      { new: true },
    );
    res.json(updatedSong);
  } catch (error) {
    next(error);
  }
};

// Delete song endpoint
const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.findByIdAndDelete(id);
    res.json({ message: "Song deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export { allSongs, getSong, createSong, editSong, deleteSong };
