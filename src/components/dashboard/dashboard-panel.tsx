import {
  dashboardPanel,
  dashboardPanelDescription,
  dashboardPanelTitle,
} from "@/components/dashboard/dashboard-theme";
import { cn } from "@/lib/utils";

interface DashboardPanelProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardPanel({
  title,
  description,
  children,
  className,
  contentClassName,
}: DashboardPanelProps) {
  return (
    <section className={cn(dashboardPanel, className)}>
      <h2 className={dashboardPanelTitle}>{title}</h2>
      {description ? (
        <p className={dashboardPanelDescription}>{description}</p>
      ) : null}
      <div className={cn("mt-6", contentClassName)}>{children}</div>
    </section>
  );
}
