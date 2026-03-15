export default function LoginButton() {
  const api = process.env.REACT_APP_API_URL;

  return (
    <a href={`${api}/api/auth/google`}>
      <button type="button" style={{ background: "#e14e84", color: "#fff", border: "none", padding: "8px 16px", fontWeight: "bold", cursor: "pointer", fontSize:"1.5rem", borderRadius:"10px" }}>
        Sign in with Google
      </button>
    </a>
  );
}
