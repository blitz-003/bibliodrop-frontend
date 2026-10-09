"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  ShoppingBag,
  Clock,
  BookOpen,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";
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

const COLORS = ["#635BFF", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];

function UserOverviewContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-dashboard-metrics"],
    queryFn: async () => {
      const { data, error } = await authClient.token();

      if (error) {
        console.error(error);
        throw new Error("Failed to retrieve authentication token.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/user`,
        {
          headers: {
            Authorization: `Bearer ${data?.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Could not load fresh dashboard summaries.");
      }

      return res.json();
    },
  });

  // Handle Loading State
  if (isLoading) return <DashboardSkeleton />;

  // Handle Error State
  if (isError) {
    return (
      <div className="mx-auto w-full max-w-app text-center">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">Could not load your dashboard</p>
          <p className="mt-1.5 text-xs">
            Something went wrong while loading your reading insights. Please try
            refreshing the page.
          </p>
        </Alert>
      </div>
    );
  }

  // Safely extract stats and charts with default fallbacks
  const { stats = {}, charts = {} } = data || {};

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-4 px-1 sm:px-0">
      <PageHeader
        title="Reading Dashboard"
        subtitle="Track your books, borrowing, and spending."
      />

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0 [&>*]:min-w-0">
        <StatCard
          label="Total Spent"
          value={`$${Number(stats.totalSpent || 0).toFixed(2)}`}
          icon={Wallet}
          tone="emerald"
        />
        <StatCard
          label="Books Read"
          value={stats.totalBooksRead || 0}
          icon={BookOpen}
          tone="indigo"
        />
        <StatCard
          label="Pending Deliveries"
          value={stats.pendingDeliveries || 0}
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Currently Borrowed"
          value={stats.activeBorrowing || 0}
          icon={ShoppingBag}
          tone="sky"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 [&>*]:min-w-0">
        <ChartPanel title="Monthly Spending" icon={BarChart3}>
          {charts.monthlySpending?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="min-w-0">
              <BarChart data={charts.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="month" stroke={AXIS_COLOR} />
                <YAxis stroke={AXIS_COLOR} />
                <Tooltip
                  formatter={(v) => [`$${v}`, "Spent"]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar dataKey="amount" fill={BRAND_HEX} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState>No spending data yet.</ChartEmptyState>
          )}
        </ChartPanel>

        <ChartPanel title="Reading Categories" icon={PieIcon}>
          {charts.categoryDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="min-w-0">
              <PieChart>
                <Pie
                  data={charts.categoryDistribution}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={70}
                >
                  {charts.categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState>No category data yet.</ChartEmptyState>
          )}
        </ChartPanel>
      </div>
    </div>
  );
}

export default function UserOverviewPage() {
  return <UserOverviewContent />;
}





