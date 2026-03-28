interface AuthBackgroundProps {
  children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <div className="relative z-0 min-h-screen flex flex-col items-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 mt-56">
        <div className="flex flex-col gap-4">
          <img src="/S.png" alt="Spot It" className="w-full h-full" />
          <img src="/Spot It.png" alt="Spot It" className="w-full h-full" />
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
