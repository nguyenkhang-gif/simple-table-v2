import { useState } from "react";
import App from "./App";
import { DataTableV2Demo } from "./DataTableV2Demo";

export function Root() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div>
      <div className="flex justify-center gap-2 border-b border-gray-200 p-2 dark:border-gray-800">
        <button
          onClick={() => setShowDemo(false)}
          className={`rounded px-3 py-1 text-sm ${!showDemo ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600"}`}
        >
          App (useExpenses)
        </button>
        <button
          onClick={() => setShowDemo(true)}
          className={`rounded px-3 py-1 text-sm ${showDemo ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600"}`}
        >
          DataTableV2 Demo
        </button>
      </div>
      {showDemo ? <DataTableV2Demo /> : <App />}
    </div>
  );
}
