import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main style={{ padding: "8px", overflowY: "auto", flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
