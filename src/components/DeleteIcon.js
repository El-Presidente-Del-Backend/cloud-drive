import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export const DeleteIcon = forwardRef(
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
        className={`delete-icon ${className}`}
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
          <g className={isAnimating ? 'animate-lid' : ''}>
            <path d="M3 6h18" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </g>
          <path 
            d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8" 
            className={isAnimating ? 'animate-bin' : ''}
          />
          <line 
            x1="10" 
            y1="11" 
            x2="10" 
            y2="17" 
            className={isAnimating ? 'animate-line' : ''}
          />
          <line 
            x1="14" 
            y1="11" 
            x2="14" 
            y2="17" 
            className={isAnimating ? 'animate-line' : ''}
          />
        </svg>
      </div>
    );
  }
);

DeleteIcon.displayName = 'DeleteIcon';

export default DeleteIcon;