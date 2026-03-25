import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Spin, Typography } from "antd";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="homePage"
        style={{ minHeight: "60vh", justifyContent: "center" }}
      >
        <Spin size="large" />
        <Typography.Text>Loading...</Typography.Text>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
