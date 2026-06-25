"use client";

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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

const adminOverviewClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

function AdminOverviewContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: () =>
      fetch("http://localhost:5000/dashboard/admin", {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Could not load system matrices.");
        return res.json();
      }),
  });

  if (isLoading)
    return (
      <p className="p-6 text-sm font-medium text-gray-400 animate-pulse">
        Loading system grids...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-sm font-medium text-red-500">
        Error reading ecosystem stats.
      </p>
    );

  const { stats, charts } = data;

  return (
    <div className="w-full space-y-6 p-4 md:p-8 font-sans text-gray-700 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Ecosystem Control Panel
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Ecosystem audit logs, network parameters, and multi-tier queue
          parameters.
        </p>
      </div>

      {/* CARDS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Total Profiles
            </span>
            <h2 className="text-xl md:text-2xl font-black text-indigo-900">
              {stats.totalUsers || 0} Nodes
            </h2>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Total Books
            </span>
            <h2 className="text-xl md:text-2xl font-black text-sky-900">
              {stats.totalBooks || 0} Titles
            </h2>
          </div>
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Approval Pendings
            </span>
            <h2 className="text-xl md:text-2xl font-black text-amber-900">
              {stats.pendingApprovals || 0} Queue
            </h2>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Platform Gross GMV
            </span>
            <h2 className="text-xl md:text-2xl font-black text-emerald-900">
              ${Number(stats.platformGmv || 0).toFixed(2)}
            </h2>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* PLOT ANALYTICS MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Platform Profile
            Registrations
          </h3>
          <div className="h-64 w-full text-xs">
            {charts.userRegistrationTrends?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.userRegistrationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#635BFF"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No profile growth tracked.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Site-wide
            Financial Volume Velocity
          </h3>
          <div className="h-64 w-full text-xs">
            {charts.revenueVelocity?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.revenueVelocity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip formatter={(value) => [`$${value}`, "GMV Volume"]} />
                  <Bar
                    dataKey="grossAmount"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No system transaction velocity logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  return (
    <QueryClientProvider client={adminOverviewClient}>
      <AdminOverviewContent />
    </QueryClientProvider>
  );
}
