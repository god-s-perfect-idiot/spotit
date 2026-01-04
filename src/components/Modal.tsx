import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ children, className = "" }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current && containerRef.current) {
        // Get the computed padding from the container
        const computedStyle = window.getComputedStyle(containerRef.current);
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        
        // Height = content height + top padding + bottom padding
        const contentHeight = contentRef.current.scrollHeight;
        const totalHeight = contentHeight + paddingTop + paddingBottom;
        
        setHeight(totalHeight);
      }
    };

    // Initial measurement
    updateHeight();

    // Use ResizeObserver to watch for content changes
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });

      resizeObserver.observe(contentRef.current);

      // Also update after a short delay to catch any async rendering
      const timeoutId = setTimeout(updateHeight, 50);
      const timeoutId2 = setTimeout(updateHeight, 100);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
      };
    }
  }, [children]);

  return createPortal(
    <div 
      ref={containerRef}
      className={`bg-[#FFE9E5] fixed bottom-0 left-0 right-0 rounded-t-[3rem] mx-0 p-8 w-full shadow-2xl z-50 overflow-hidden ${className}`}
      style={{ 
        height: height === 'auto' ? 'auto' : `${height}px`,
        transition: 'height 300ms ease-in-out'
      }}
    >
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </div>,
    document.body
  );
}
