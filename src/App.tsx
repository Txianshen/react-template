import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "@/components/ui/sonner";
import { AliveScope } from "react-activation";
import "./App.css";

function App() {
  return (
    <AliveScope>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AliveScope>
  );
}

export default App;
