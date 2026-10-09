"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  Truck,
  ShieldAlert,
  BarChart3,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Alert,
  PageHeader,
  StatCard,
  ChartPanel,
  ChartEmptyState,
  DashboardSkeleton,
  AXIS_COLOR,
  GRID_COLOR,
  BRAND_HEX,
  TOOLTIP_STYLE,
} from "@/components/ui";

function LibrarianOverviewContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["librarian-dashboard-metrics"],

    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/librarian`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Could not load librarian data.");
      }

      return res.json();
    },
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">Error reading library metrics</p>
          <p className="mt-1 text-sm">
            We could not load the librarian dashboard. Please try refreshing the
            page.
          </p>
        </Alert>
      </div>
    );

  const { stats, charts } = data;

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Librarian Dashboard"
        subtitle="Manage your catalog, deliveries, and book requests."
      />

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0 [&>*]:min-w-0">
        <StatCard
          label="Total Sales"
          value={`$${Number(stats.totalSales || 0).toFixed(2)}`}
          icon={BarChart2}
          tone="emerald"
        />
        <StatCard
          label="My Managed Books"
          value={stats.totalBooks || 0}
          unit="units"
          icon={BookOpen}
          tone="indigo"
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingRequests || 0}
          unit="items"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Active Deliveries"
          value={stats.activeDeliveries || 0}
          unit="shipped"
          icon={Truck}
          tone="sky"
        />
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 [&>*]:min-w-0">
          <ChartPanel title="Borrowing Trends" icon={BarChart3}>
          {charts.circulationData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="min-w-0">
              <BarChart data={charts.circulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="day" stroke={AXIS_COLOR} />
                <YAxis stroke={AXIS_COLOR} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar
                  dataKey="requests"
                  fill={BRAND_HEX}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState>No borrowing data yet.</ChartEmptyState>
          )}
        </ChartPanel>

          <ChartPanel title="New Books Added" icon={ShieldAlert}>
          {charts.stockGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="min-w-0">
              <AreaChart data={charts.stockGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="week" stroke={AXIS_COLOR} />
                <YAxis stroke={AXIS_COLOR} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="added"
                  stroke="#10B981"
                  fill="#E6F4EA"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState>No stock history yet.</ChartEmptyState>
          )}
        </ChartPanel>
      </div>
    </div>
  );
}

export default function LibrarianOverview() {
  return <LibrarianOverviewContent />;
}




