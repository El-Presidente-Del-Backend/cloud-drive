import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export const DownloadIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className = '', size = 28, ...props }, ref) => {
    const controls = useRef({ active: false });
    const isControlledRef = useRef(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => setIsAnimating(true),
        stopAnimation: () => setIsAnimating(false),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          setIsAnimating(true);
        } else {
          onMouseEnter?.(e);
        }
      },
      [onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          setIsAnimating(false);
        } else {
          onMouseLeave?.(e);
        }
      },
      [onMouseLeave]
    );

    return (
      <div
        className={`download-icon ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <g className={isAnimating ? 'animate-arrow' : ''}>
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </g>
        </svg>
      </div>
    );
  }
);

DownloadIcon.displayName = 'DownloadIcon';

export default DownloadIcon;