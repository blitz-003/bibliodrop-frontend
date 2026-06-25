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

const userOverviewClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

const COLORS = ["#635BFF", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];

function UserOverviewContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-dashboard-metrics"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/user`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok)
          throw new Error("Could not load fresh dashboard summaries.");
        return res.json();
      }),
  });

  if (isLoading)
    return (
      <p className="p-6 text-sm font-medium text-gray-400 animate-pulse">
        Loading overview metrics...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-sm font-medium text-red-500">
        Error rendering data metrics models.
      </p>
    );

  const { stats, charts } = data;

  return (
    <div className="w-full space-y-6 p-4 md:p-8 font-sans text-gray-700 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Reader Insights Overview
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Track your personal reading logistics and financial history.
        </p>
      </div>

      {/* METRICS CARDS GRID (MOBILE RESPONSIVE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Total Spent
            </span>
            <h2 className="text-xl md:text-2xl font-black text-indigo-900">
              ${Number(stats.totalSpent || 0).toFixed(2)}
            </h2>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Total Books Read
            </span>
            <h2 className="text-xl md:text-2xl font-black text-sky-900">
              {stats.totalBooksRead || 0} Units
            </h2>
          </div>
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Pending Deliveries
            </span>
            <h2 className="text-xl md:text-2xl font-black text-amber-900">
              {stats.pendingDeliveries || 0} Orders
            </h2>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Active Borrowing
            </span>
            <h2 className="text-xl md:text-2xl font-black text-emerald-900">
              {stats.activeBorrowing || 0} Books
            </h2>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CHARTS GRAPHICS REGION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MONTHLY SPENDING BAR CHART */}
        <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Monthly Spending
            Summary
          </h3>
          <div className="h-64 w-full text-xs">
            {charts.monthlySpending?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Bar dataKey="amount" fill="#635BFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No monthly transactional history available.
              </div>
            )}
          </div>
        </div>

        {/* CATEGORY DISTRIBUTION PIE CHART */}
        <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-sky-600" /> Book Categories
            Distribution
          </h3>
          <div className="h-64 w-full text-xs flex items-center justify-center">
            {charts.categoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Books"]} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No historical category data logged.
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
