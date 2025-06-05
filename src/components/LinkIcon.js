import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export const LinkIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className = '', size = 28, ...props }, ref) => {
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
        className={`link-icon ${className}`}
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
          <path
            className={isAnimating ? 'animate-link-path' : ''}
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
          />
          <path
            className={isAnimating ? 'animate-link-path' : ''}
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
          />
        </svg>
      </div>
    );
  }
);

LinkIcon.displayName = 'LinkIcon';

export default LinkIcon;