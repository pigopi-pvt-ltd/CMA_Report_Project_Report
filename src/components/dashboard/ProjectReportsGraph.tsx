"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// 🔹 Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

type GraphItem = {
  month: string;
  count: number;
};

// 🔑 Fixed 12 months
const ALL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// 🎨 Same colors
const COLORS = [
  "#0ea5e9",
  "#84cc16",
  "#22d3ee",
  "#a855f7",
  "#facc15",
  "#f97316",
];

export default function ProjectReportsGraph({
  graphData,
}: {
  graphData: GraphItem[];
}) {
  const [page, setPage] = useState(0);

  // 🔹 Backend data map
  const dataMap = new Map(
    graphData.map((item) => [item.month, item.count])
  );

  // 🔹 Ensure all months exist
  const allValues = ALL_MONTHS.map(
    (month) => dataMap.get(month) ?? 0
  );

  // 🔹 Visible 6 months
  const visibleMonths = ALL_MONTHS.slice(page * 6, page * 6 + 6);
  const visibleValues = allValues.slice(page * 6, page * 6 + 6);
  const visibleColors = COLORS.slice(0, 6);

  // 🔴 Trend slightly above bars
  const trendValues = visibleValues.map((v) =>
    v === 0 ? 0 : v + Math.max(1, v * 0.08)
  );

  const data = {
    labels: visibleMonths,
    datasets: [
      {
        type: "bar" as const,
        label: "Project Reports",
        data: visibleValues,
        backgroundColor: visibleColors,
        categoryPercentage: 1,
        barPercentage: 1,
      },
      {
        type: "line" as const,
        label: "Trend",
        data: trendValues,
        borderColor: visibleColors,
        pointBackgroundColor: visibleColors,
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 6,
        
      },
    ],
  };

  // ✅ INTEGER SCALE FIX
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: {
          precision: 0, // ❌ decimals remove
          stepSize: 1,  // ✅ 0,1,2,3...
        },
      },
    },
  };

  return (
    <div className="w-[420px]">
      {/* 🔘 Navigation buttons */}
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
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
