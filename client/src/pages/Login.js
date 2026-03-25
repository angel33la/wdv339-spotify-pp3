import LoginButton from "../components/auth/LoginButton";
import { Typography } from "antd";

export default function Login() {
  return (
    <div
      className="homePage"
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
        src="/images/logo-120.png"
        srcSet="/images/logo-120.png 1x, /images/logo-240.png 2x"
        sizes="120px"
        alt="Music/Search/Play App logo"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
        }}
      />
      <Typography.Title level={1} className="homeTitle">
        Music/Search/Play App
      </Typography.Title>
      <LoginButton />
    </div>
  );
}
