import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import useGeekTheme from "./geekTheme";
import "antd/dist/reset.css";
import "./App.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function RootApp() {
  const configProps = useGeekTheme();

  return (
    <ConfigProvider {...configProps}>
      <AuthProvider>
        <App />
        <Analytics />
      </AuthProvider>
    </ConfigProvider>
  );
}

root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
