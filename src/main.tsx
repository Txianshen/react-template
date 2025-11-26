import { createRoot } from "react-dom/client";
// import { AliveScope } from "react-activation";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./providers/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  // <AliveScope>
  //   {/* enableSystem */}
  //   <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
  //     <App />
  //   </ThemeProvider>
  // </AliveScope>
  <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
    <App />
  </ThemeProvider>
);
