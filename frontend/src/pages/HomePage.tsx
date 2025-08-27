import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-10">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-10 border border-blue-100 text-center z-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 tracking-tight drop-shadow-lg font-sans">
          Welcome to Learning Remind
        </h1>
        <h2 className="text-xl text-gray-600 mb-8 font-medium">
          Your personal learning and review assistant
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="px-8 py-4 text-lg font-bold shadow-md bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all"
          >
            <Link to="/create">Create Vocab List</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-8 py-4 text-lg font-bold shadow-md border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <Link to="/view">View My Folders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
