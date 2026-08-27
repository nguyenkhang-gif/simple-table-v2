import { useState } from "react";
import App from "./App";
import { DataTableV2Demo } from "./DataTableV2Demo";
import { FormV2Demo } from "./FormV2Demo";

type Tab = "app" | "table" | "form";

const TABS: { key: Tab; label: string }[] = [
  { key: "app", label: "App (useExpenses)" },
  { key: "table", label: "DataTableV2 Demo" },
  { key: "form", label: "FormV2 Demo" },
];

export function Root() {
  const [tab, setTab] = useState<Tab>("app");

  return (
    <div>
      <div className="flex justify-center gap-2 border-b border-gray-200 p-2 dark:border-gray-800">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded px-3 py-1 text-sm ${
              tab === key
                ? "bg-blue-600 text-white"
                : "border border-gray-300 dark:border-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "app" && <App />}
      {tab === "table" && <DataTableV2Demo />}
      {tab === "form" && <FormV2Demo />}
    </div>
  );
}
