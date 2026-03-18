import LoginButton from "../components/auth/LoginButton";
import { Typography } from "antd";

export default function Login() {
  return (
    <div
      className="home-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        padding: "0",
      }}
    >
      <Typography.Title level={1} className="home-title">
        Music Matie App
      </Typography.Title>
      <LoginButton />
    </div>
  );
}
