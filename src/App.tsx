import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000, // 默认2秒后消失
          style: {
            background: "#0b1220", // 深蓝黑色背景，与cyber大屏风格一致
            color: "#cffafe", // 青色文字，与cyber大屏文字颜色一致
            border: "1px solid rgba(0, 217, 255, 0.3)", // 青色边框，带透明度
            boxShadow: "0 0 10px rgba(0, 217, 255, 0.5)", // 青色发光效果
          },
          className: "cyber-toast",
        }}
      />
    </>
  );
}

export default App;
