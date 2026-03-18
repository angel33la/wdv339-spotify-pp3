import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Typography } from "antd";
import { AuthContext } from "../context/AuthContext";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useContext(AuthContext);

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      loginWithToken(token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [params, loginWithToken, navigate]);

  return (
    <div
      className="home-page"
      style={{ minHeight: "60vh", justifyContent: "center" }}
    >
      <Spin size="large" />
      <Typography.Text>Signing you in...</Typography.Text>
    </div>
  );
}
