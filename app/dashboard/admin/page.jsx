"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  AlertTriangle,
  Activity,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
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

function AdminOverviewContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: async () => {
      const { data } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Could not load system matrices.");
      }

      return res.json();
    },
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Could not load dashboard stats.
          </p>
          <p className="mt-1 text-sm">
            We could not load the admin dashboard. Please try refreshing the
            page.
          </p>
        </Alert>
      </div>
    );

  const { stats, charts } = data;

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Admin Dashboard"
        subtitle="An overview of users, books, and activity."
      />

      {/* CARDS METRICS GRID */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0 [&>*]:min-w-0">
        <StatCard
          label="Total Users"
          value={stats.totalUsers || 0}
          unit="users"
          icon={Users}
          tone="indigo"
        />
        <StatCard
          label="Total Books"
          value={stats.totalBooks || 0}
          unit="titles"
          icon={BookOpen}
          tone="sky"
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingApprovals || 0}
          unit="waiting"
          icon={AlertTriangle}
          tone="amber"
        />
        <StatCard
          label="Total Revenue"
          value={`$${Number(stats.platformGmv || 0).toFixed(2)}`}
          icon={DollarSign}
          tone="emerald"
        />
      </div>

      {/* PLOT ANALYTICS MODULES */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 [&>*]:min-w-0">
        <ChartPanel title="New Users" icon={TrendingUp}>
          {charts.userRegistrationTrends?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="min-w-0">
              <LineChart data={charts.userRegistrationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="month" stroke={AXIS_COLOR} />
                <YAxis stroke={AXIS_COLOR} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke={BRAND_HEX}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState>No new users yet.</ChartEmptyState>
          )}
        </ChartPanel>

        <ChartPanel
          title="Revenue Over Time"
          icon={Activity}
        >
          {charts.revenueVelocity?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="min-w-0">
              <BarChart data={charts.revenueVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="month" stroke={AXIS_COLOR} />
                <YAxis stroke={AXIS_COLOR} />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Revenue"]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="grossAmount"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState>
              No transactions yet.
            </ChartEmptyState>
          )}
        </ChartPanel>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  return <AdminOverviewContent />;
}




