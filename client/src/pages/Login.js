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
      <img
        src="/favicon.png"
        alt="Music Matie logo"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
        }}
      />
      <Typography.Title level={1} className="home-title">
        Music Matie App
      </Typography.Title>
      <LoginButton />
    </div>
  );
}
