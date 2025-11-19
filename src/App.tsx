import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
