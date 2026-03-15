export default function VideoPlayer({ videoId }) {
  if (!videoId) return null;

  return (
    <iframe
      width="100%"
      height="400"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube player"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}
