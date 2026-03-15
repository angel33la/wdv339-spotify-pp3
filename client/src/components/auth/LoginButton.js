export default function LoginButton() {
  const api = process.env.REACT_APP_API_URL;

  return (
    <a href={`${api}/api/auth/google`}>
      <button type="button">Sign in with Google</button>
    </a>
  );
}
