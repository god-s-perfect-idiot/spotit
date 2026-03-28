import { useEffect } from "react";
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useNavbarVisibility } from "./context/NavbarVisibilityContext";
import { Loader } from "./components/ui-kit/Loader";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { initializeAppData } from "./store/appDataSlice";

export default function Layout() {
  const { isNavbarVisible } = useNavbarVisibility();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const appDataStatus = useAppSelector((s) => s.appData.status);

  const shellReady =
    isAuthenticated && Boolean(user?.completedOnboarding);
  const shouldLoad = shellReady && appDataStatus === "idle";
  const showInitLoader =
    shellReady && (appDataStatus === "idle" || appDataStatus === "loading");

  useEffect(() => {
    if (shouldLoad) {
      void dispatch(initializeAppData());
    }
  }, [dispatch, shouldLoad]);

  return (
    <div
      className={`flex flex-col h-screen overflow-y-auto ${isNavbarVisible ? "pb-24" : ""}`}
    >
      {showInitLoader ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12">
          <Loader />
        </div>
      ) : (
        <Outlet />
      )}
      {isNavbarVisible && !showInitLoader ? <Navbar /> : null}
    </div>
  );
}