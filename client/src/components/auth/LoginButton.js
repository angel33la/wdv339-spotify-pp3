import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getApiBaseUrl } from "../../utils/apiBaseUrl";

export default function LoginButton() {
  const api = getApiBaseUrl();

  return (
    <a href={`${api}/api/auth/google`}>
      <Button
        type="primary"
        icon={<GoogleOutlined />}
        size="large"
        className="loginGoogleButton pinkActionButton"
      >
        Sign in with Google
      </Button>
    </a>
  );
}
