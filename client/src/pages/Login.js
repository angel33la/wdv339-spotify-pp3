import LoginButton from "../components/auth/LoginButton";
import { Typography } from "antd";

export default function Login() {
  return (
    <div
      className="home-page"
      style={{ minHeight: "100vh", justifyContent: "center" }}
    >
      <Typography.Title level={1} className="home-title">
        Music Search App
      </Typography.Title>
      <LoginButton />
    </div>
  );
}
