import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-y-auto pb-24">
      <Outlet />
      <Navbar />
    </div>
  );
}