"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CsiChartProps {
  amplitudes: number[];
}

export default function CsiChart({ amplitudes }: CsiChartProps) {
  const data = amplitudes.map((value, index) => ({
    subcarrier: index,
    amplitude: value,
  }));

  if (amplitudes.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 text-slate-400">
        Waiting for CSI data...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        CSI Amplitude (Latest Packet)
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis
            dataKey="subcarrier"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="amplitude"
            stroke="#22d3ee"
            dot={false}
            strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
