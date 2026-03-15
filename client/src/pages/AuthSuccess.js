import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  return <p>Signing you in...</p>;
}
