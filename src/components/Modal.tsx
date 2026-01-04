interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ children, className = "" }: ModalProps) {
  return (
    <div className={`bg-[#FFE9E5] fixed bottom-0 rounded-t-[3rem] mx-0 p-8 w-full max-w-[33rem] shadow-2xl ${className}`}>
      {children}
    </div>
  );
}
