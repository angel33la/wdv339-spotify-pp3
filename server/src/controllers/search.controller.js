import { searchYouTubeMusic } from "../utils/youtubeService.js";

export const searchSongs = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await searchYouTubeMusic(query);

    res.status(200).json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("YouTube search error:", error.message);

    res.status(500).json({
      message: "Failed to search YouTube",
    });
  }
};
