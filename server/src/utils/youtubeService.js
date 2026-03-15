import axios from "axios";

export const searchYouTubeMusic = async (query) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        type: "video",
        videoCategoryId: "10",
        maxResults: 12,
      },
    },
  );

  return response.data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url || "",
    publishedAt: item.snippet.publishedAt,
  }));
};
