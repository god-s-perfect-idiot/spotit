import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useNavbarVisibility } from "./context/NavbarVisibilityContext";

export default function Layout() {
  const { isNavbarVisible } = useNavbarVisibility();

  return (
    <div className={`flex flex-col h-screen overflow-y-auto ${isNavbarVisible ? "pb-24" : ""}`}>
      <Outlet />
      {isNavbarVisible ? <Navbar /> : null}
    </div>
  );
}