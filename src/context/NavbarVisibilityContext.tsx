import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type NavbarVisibilityContextValue = {
  isNavbarVisible: boolean;
  showNavbar: () => void;
  hideNavbar: () => void;
  setNavbarVisible: (visible: boolean) => void;
};

const NavbarVisibilityContext = createContext<NavbarVisibilityContextValue | undefined>(undefined);

export function NavbarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const showNavbar = useCallback(() => {
    setIsNavbarVisible(true);
  }, []);

  const hideNavbar = useCallback(() => {
    setIsNavbarVisible(false);
  }, []);

  const setNavbarVisible = useCallback((visible: boolean) => {
    setIsNavbarVisible(visible);
  }, []);

  const value = useMemo(
    () => ({
      isNavbarVisible,
      showNavbar,
      hideNavbar,
      setNavbarVisible,
    }),
    [hideNavbar, isNavbarVisible, setNavbarVisible, showNavbar]
  );

  return <NavbarVisibilityContext.Provider value={value}>{children}</NavbarVisibilityContext.Provider>;
}

export function useNavbarVisibility() {
  const context = useContext(NavbarVisibilityContext);

  if (!context) {
    throw new Error('useNavbarVisibility must be used within NavbarVisibilityProvider');
  }

  return context;
}
