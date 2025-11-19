import { Outlet } from "react-router-dom";
// import { ThemeToggle } from '../components/ThemeToggle'
export default function Layout() {
  return (
    <div>
      {/* <ThemeToggle /> */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
