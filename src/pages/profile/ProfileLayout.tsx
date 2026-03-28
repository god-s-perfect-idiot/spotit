import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Outlet />
    </div>
  );
}
