import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function LoginButton() {
  const api = process.env.REACT_APP_API_URL;

  return (
    <a href={`${api}/api/auth/google`}>
      <Button type="primary" icon={<GoogleOutlined />} size="large">
        Sign in with Google
      </Button>
    </a>
  );
}
