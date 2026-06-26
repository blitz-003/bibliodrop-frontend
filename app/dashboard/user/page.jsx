"use client";

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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

const userOverviewClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

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
  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 md:p-8 max-w-[1400px] mx-auto animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 border border-gray-200 rounded-xl"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white border border-gray-200 rounded-xl"></div>
          <div className="h-80 bg-white border border-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Handle Error State
  if (isError) {
    return (
      <div className="w-full p-8 max-w-[1400px] mx-auto text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl inline-block max-w-md">
          <h3 className="font-semibold text-lg mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-sm">
            There was an issue fetching your reading insights. Please try
            refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Safely extract stats and charts with default fallbacks
  const { stats = {}, charts = {} } = data || {};

  return (
    <div className="w-full space-y-6 p-4 md:p-8  text-gray-700 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 ">
          Reading Dashboard
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Track your reading habits, borrowing activity, and spending insights.
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-700 uppercase ">
              Total Spent
            </span>
            <h2 className="text-xl md:text-2xl font-black text-emerald-900">
              ${Number(stats.totalSpent || 0).toFixed(2)}
            </h2>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Books Read */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-700 uppercase ">
              Books Read
            </span>
            <h2 className="text-xl md:text-2xl font-black text-indigo-900">
              {stats.totalBooksRead || 0}
            </h2>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-700 uppercase ">
              Pending Deliveries
            </span>
            <h2 className="text-xl md:text-2xl font-black text-amber-900">
              {stats.pendingDeliveries || 0}
            </h2>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Currently Borrowed */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sky-700 uppercase ">
              Currently Borrowed
            </span>
            <h2 className="text-xl md:text-2xl font-black text-sky-900">
              {stats.activeBorrowing || 0}
            </h2>
          </div>
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Monthly Spending
          </h3>
          <div className="h-64">
            {charts.monthlySpending?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => [`$${v}`, "Spent"]} />
                  <Bar dataKey="amount" fill="#635BFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed">
                No spending history found.
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-600" />
            Reading Categories
          </h3>
          <div className="h-64">
            {charts.categoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={85}
                    label
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed">
                No category insights available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserOverviewPage() {
  return (
    <QueryClientProvider client={userOverviewClient}>
      <UserOverviewContent />
    </QueryClientProvider>
  );
}
