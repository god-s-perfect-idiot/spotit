import {
  BookOpenText,
  CircleUserRound,
  House,
  SearchCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function NavbarItem({
  icon,
  label,
  onClick,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-1 items-center justify-center transition-all duration-300 ease-in-out ${
        isActive 
          ? "text-white" 
          : "text-[#ffffff70] hover:text-white"
      }`}
    >
      <div className="transition-all duration-300">
        {icon}
      </div>
      <span className={`text-sm font-medium transition-all duration-300 ${isActive ? "opacity-100" : "opacity-70"}`}>
        {label}
      </span>
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className="w-full shadow-2xl shadow-black/20 flex flex-row h-[11%] absolute bottom-0 rounded-t-[3rem] px-4 items-center justify-between px-12"
      style={{
        background:
          "linear-gradient(150.18deg, #FF6961 26.55%, #FF8D7B 69.81%, #f5a99f 97.01%)",
        boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
    >
      <NavbarItem
        icon={<House />}
        label="Home"
        onClick={() => handleTabClick("/home")}
        isActive={isActive("/home")}
      />
      <NavbarItem
        icon={<SearchCheck />}
        label="Insights"
        onClick={() => handleTabClick("/insights")}
        isActive={isActive("/insights")}
      />
      <NavbarItem
        icon={<BookOpenText />}
        label="Read"
        onClick={() => handleTabClick("/read")}
        isActive={isActive("/read")}
      />
      <NavbarItem
        icon={<CircleUserRound />}
        label="Profile"
        onClick={() => handleTabClick("/profile")}
        isActive={isActive("/profile")}
      />
    </div>
  );
}
