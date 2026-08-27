import { useState } from "react";
import { DataTableV2Demo } from "./DataTableV2Demo";
import { FormV2Demo } from "./FormV2Demo";
import { useDarkMode } from "./hooks/useDarkMode";
import { Button } from "@/components/ui/button";

type Tab = "table" | "form";

const TABS: { key: Tab; label: string }[] = [
  { key: "table", label: "DataTableV2 Demo" },
  { key: "form", label: "FormV2 Demo" },
];

export function Root() {
  const [tab, setTab] = useState<Tab>("table");
  const { dark, toggle } = useDarkMode();

  return (
    <div>
      <div className="flex items-center justify-center gap-2 border-b p-2">
        {TABS.map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={tab === key ? "default" : "outline"}
            onClick={() => setTab(key)}
          >
            {label}
          </Button>
        ))}

        <Button size="sm" variant="ghost" onClick={toggle} className="ml-4">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </Button>
      </div>

      {tab === "table" && <DataTableV2Demo />}
      {tab === "form" && <FormV2Demo />}
    </div>
  );
}
