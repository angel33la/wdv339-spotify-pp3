import LoginButton from "../components/auth/LoginButton";

export default function Login() {
  return (
    <div
      style={{
        textAlign: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#1a143c" }}>Music Search App</h1>
      <LoginButton />
    </div>
  );
}
 