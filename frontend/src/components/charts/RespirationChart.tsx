"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Point {
  time: number;
  respiration: number;
}

export default function RespirationChart({
  data,
}: {
  data: Point[];
}) {
  return (
    <div className="bg-slate-900 rounded-xl p-6">

      <h2 className="text-xl font-bold text-white mb-5">
        Live Respiration
      </h2>

      <div style={{ width: "100%", height: 260 }}>

        <ResponsiveContainer>

          <LineChart data={data}>

            <XAxis hide dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="respiration"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}