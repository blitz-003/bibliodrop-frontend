"use client";

import { authClient } from "@/lib/auth-client";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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

const librarianOverviewClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

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

  if (isLoading)
    return (
      <p className="p-6 text-sm font-medium text-gray-400 animate-pulse">
        Loading branch metrics...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-sm font-medium text-red-500">
        Error reading library metrics.
      </p>
    );

  const { stats, charts } = data;

  return (
    <div className="w-full space-y-6 p-4 md:p-8 font-sans text-gray-700 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Librarian Console Hub
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage branch catalogs, circulation speeds, and active dispatches.
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Total Sales
            </span>
            <h2 className="text-xl md:text-2xl font-black text-emerald-900">
              ${Number(stats.totalSales || 0).toFixed(2)}
            </h2>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              My Managed Books
            </span>
            <h2 className="text-xl md:text-2xl font-black text-indigo-900">
              {stats.totalBooks || 0} Units
            </h2>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Pending Requests
            </span>
            <h2 className="text-xl md:text-2xl font-black text-amber-900">
              {stats.pendingRequests || 0} Items
            </h2>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Active Deliveries
            </span>
            <h2 className="text-xl md:text-2xl font-black text-sky-900">
              {stats.activeDeliveries || 0} Shipped
            </h2>
          </div>
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> System Circulation
            Trends
          </h3>
          <div className="h-64 w-full text-xs">
            {charts.circulationData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.circulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar
                    dataKey="requests"
                    fill="#635BFF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No circulation metrics available.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600" /> Branch
            Inventory Additions
          </h3>
          <div className="h-64 w-full text-xs">
            {charts.stockGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.stockGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
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
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No stock history found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LibrarianOverview() {
  return (
    <QueryClientProvider client={librarianOverviewClient}>
      <LibrarianOverviewContent />
    </QueryClientProvider>
  );
}
