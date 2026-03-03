"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ProjectReportsGraph({ graphData }: { graphData: any[] }) {
  const [page, setPage] = useState(0);

  const visibleData = useMemo(() => {
    const map = new Map((graphData || []).map((d: any) => [d.month, d.count]));
    const currentMonths = ALL_MONTHS.slice(page * 6, page * 6 + 6);

    const data = currentMonths.map((month) => {
      const value = map.get(month) ?? 0;
      return { month, value, trend: value }; // Exact value for trend
    });

    return [
      { month: "", value: null, trend: data[0].trend, isDummy: true },
      ...data,
      { month: " ", value: null, trend: data[data.length - 1].trend, isDummy: true }
    ];
  }, [graphData, page]);

  return (
    <div className="w-[420px] bg-transparent">
      <div className="flex justify-between items-center mb-4 px-4">
        <button onClick={() => setPage(0)} disabled={page === 0} className="text-gray-400 disabled:opacity-10 text-primary">◀</button>
        <span className="text-sm font-bold text-red-600 dark:text-gray-400">
          {page === 0 ? "Jan – Jun" : "Jul – Dec"}
        </span>
        <button onClick={() => setPage(1)} disabled={page === 1} className="text-gray-400 disabled:opacity-10 text-primary">▶</button>
      </div>

      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={visibleData}
            margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeOpacity={0.1} vertical={false} strokeDasharray="3 3" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fill: 'currentColor', fontSize: 12, className: 'text-gray-500' }}
            />
            
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              domain={[0, 'dataMax + 1']} 
              tick={{ fill: 'currentColor', fontSize: 12, className: 'text-gray-500' }}
            />
            
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
              content={({ active, payload }) => {
                if (active && payload && payload.length && !payload[0].payload.isDummy) {
                  return (
                    <div className="bg-slate-800 text-white px-3 py-1 rounded shadow-lg text-xs border border-slate-700">
                      <p className="font-semibold">{`${payload[0].payload.month}: ${payload[0].value} Reports`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="value" barSize={35} radius={[4, 4, 0, 0]}>
              {visibleData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isDummy ? "transparent" : "#84cc16"} 
                />
              ))}
            </Bar>

            <Line
              type="monotone"
              dataKey="trend"
              stroke="#ef4444" 
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.isDummy) return null;
                return (
                  <circle key={cx} cx={cx} cy={cy} r={5} fill="#fff" stroke="#ef4444" strokeWidth={2} />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}