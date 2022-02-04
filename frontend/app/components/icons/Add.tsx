import React from "react";

export const Add: React.FunctionComponent<{
  width: number;
  className?: string;
  onClick: React.MouseEventHandler;
}> = ({ width, className, onClick }) => {
  return (
    <svg
      className={className}
      id="Layer_1"
      onClick={onClick}
      viewBox="0 0 24 24"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
    >
      <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm4 13h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z" />
    </svg>
  );
};
