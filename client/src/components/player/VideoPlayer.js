export default function VideoPlayer({ videoId }) {
  if (!videoId) return null;

  return (
    <iframe
      width="500"
      height="500"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube player"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}
