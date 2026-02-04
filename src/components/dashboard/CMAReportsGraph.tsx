"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type GraphItem = {
  month: string;
  count: number;
};

// 🔑 Fixed 12 months
const ALL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// 🎨 Bar colors
const COLORS = [
  "#0ea5e9",
  "#84cc16",
  "#22d3ee",
  "#a855f7",
  "#facc15",
  "#f97316",
];

export default function CMAReportsGraph({
  graphData,
}: {
  graphData: GraphItem[];
}) {
  // 0 → Jan–Jun | 1 → Jul–Dec
  const [page, setPage] = useState(0);

  // 🔹 Normalize backend data → ensure all 12 months
  const fullData = useMemo(() => {
    const map = new Map(graphData.map(d => [d.month, d.count]));

    return ALL_MONTHS.map((month) => {
      const value = map.get(month) ?? 0;

      return {
        month,
        value,
        trend: value === 0 ? 0 : value + Math.max(1, value * 0.08),
      };
    });
  }, [graphData]);

  // 🔹 Show only 6 months per page
  const visibleData = fullData.slice(page * 6, page * 6 + 6);

  return (
    <div className="w-[420px]">
      {/* 🔘 Pagination */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setPage(0)}
          disabled={page === 0}
          className="text-gray-400 disabled:opacity-30"
        >
          ◀
        </button>

        <span className="text-sm font-medium text-gray-600">
          {page === 0 ? "Jan – Jun" : "Jul – Dec"}
        </span>

        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="text-gray-400 disabled:opacity-30"
        >
          ▶
        </button>
      </div>

      {/* 📊 Chart */}
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visibleData}>
            <CartesianGrid stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />

            {/* 🔵 CMA Bars */}
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              isAnimationActive
            >
              {visibleData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Bar>

            {/* 🔴 Trend Line */}
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
