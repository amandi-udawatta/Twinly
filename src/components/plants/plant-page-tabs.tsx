"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { twinlyTabTrigger, twinlyTabsList } from "@/components/dashboard/dashboard-theme";

interface PlantPageTabsProps {
  children: React.ReactNode;
}

const TAB_ITEMS = [
  { value: "analysis", label: "Today's analysis" },
  { value: "history", label: "History" },
  { value: "gallery", label: "Gallery" },
  { value: "predictions", label: "Predictions" },
  { value: "care", label: "Care log" },
  { value: "qr", label: "QR code" },
] as const;

export function PlantPageTabs({ children }: PlantPageTabsProps) {
  return (
    <Tabs defaultValue="analysis" className="space-y-6">
      <TabsList className={twinlyTabsList}>
        {TAB_ITEMS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className={twinlyTabTrigger}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
