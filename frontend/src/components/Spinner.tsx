import React from "react";

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-[120px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default Spinner;
