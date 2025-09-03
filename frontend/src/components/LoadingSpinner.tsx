import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  center?: boolean;
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  center = true,
  fullScreen = false,
  text,
}) => {
  // Define size classes
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-16 w-16 border-4",
  };

  // Create spinner element
  const spinner = (
    <div
      className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    />
  );

  // Create wrapper with text if provided
  const content = (
    <div className="flex flex-col items-center gap-2">
      {spinner}
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {content}
      </div>
    );
  }

  if (center) {
    return (
      <div className="flex justify-center items-center py-8">{content}</div>
    );
  }

  return content;
};

export default LoadingSpinner;
