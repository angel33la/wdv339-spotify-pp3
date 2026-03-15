import { searchYouTubeMusic } from "../utils/youtubeService.js";

export const searchSongs = async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(503).json({
        message:
          "Search is not configured. Missing YOUTUBE_API_KEY on the server.",
      });
    }

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
    const statusCode = error?.response?.status || 500;

    res.status(statusCode).json({
      message: "Failed to search YouTube",
      detail: error?.response?.data?.error?.message || error.message,
    });
  }
};
