interface AuthBackgroundProps {
  children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-6"
      style={{
        background:
          "linear-gradient(to bottom right, #ff6961, #ff8d7b, #f9c1cd)",
      }}
    >
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
