import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Outlet />
      <Navbar />
    </div>
  );
}