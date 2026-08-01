"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import CsiChart from "@/components/charts/CsiChart";
import { useWebSocket } from "@/hooks/useWebSocket";

interface MonitorData {
  packetRate: number;
  rssi: number;
  activity: string;
  respiration: number;
  confidence: number;
}

interface LiveUpdateData {
  csi: number[];
  packetRate: number;
  rssi: number;
}

export default function MonitoringPage() {
  const [monitor, setMonitor] = useState<MonitorData>({
    packetRate: 0,
    rssi: 0,
    activity: "Waiting...",
    respiration: 0,
    confidence: 0,
  });

  const [csiAmplitudes, setCsiAmplitudes] = useState<number[]>([]);

  const { connected } = useWebSocket<LiveUpdateData>({
    onMessage: (message) => {
      setCsiAmplitudes(message.csi ?? []);
      setMonitor((prev) => ({
        ...prev,
        packetRate: message.packetRate ?? prev.packetRate,
        rssi: message.rssi ?? prev.rssi,
      }));
    },
  });

  useEffect(() => {
    const fetchMonitor = () => {
      axios
        .get("http://localhost:5000/api/monitor")
        .then((res) => setMonitor(res.data))
        .catch(console.error);
    };

    fetchMonitor();
    const timer = setInterval(fetchMonitor, 1000);
    return () => clearInterval(timer);
  }, []);

  const getSignalQuality = () => {
    if (monitor.rssi >= -40) {
      return {
        text: "Excellent",
        color: "text-green-400",
        width: "100%",
      };
    }

    if (monitor.rssi >= -55) {
      return {
        text: "Good",
        color: "text-yellow-400",
        width: "75%",
      };
    }

    if (monitor.rssi >= -70) {
      return {
        text: "Fair",
        color: "text-orange-400",
        width: "50%",
      };
    }

    return {
      text: "Weak",
      color: "text-red-400",
      width: "25%",
    };
  };

  const signal = getSignalQuality();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-10">
        Guardian Monitoring
      </h1>

      <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            connected ? "bg-emerald-400" : "bg-red-500"
          }`}
        />
        {connected ? "Live feed connected" : "Reconnecting..."}
      </div>

      <div className="grid grid-cols-3 gap-8">

        <div className="bg-slate-900 rounded-xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Live Monitoring
          </h2>

          <div className="space-y-6">

            <div>
              <span className="text-slate-400">
                Activity
              </span>

              <h3 className="text-3xl font-bold">
                {monitor.activity}
              </h3>
            </div>

            <div>
              <span className="text-slate-400">
                Respiration
              </span>

              <h3 className="text-3xl font-bold">
                {monitor.respiration} BPM
              </h3>
            </div>

            <div>
              <span className="text-slate-400">
                Packet Rate
              </span>

              <h3 className="text-3xl font-bold">
                {monitor.packetRate} pkt/s
              </h3>
            </div>

            <div>
              <span className="text-slate-400">
                Signal Strength
              </span>

              <h3 className="text-3xl font-bold">
                {monitor.rssi} dBm
              </h3>
            </div>

            <div>
              <span className="text-slate-400">
                Confidence
              </span>

              <h3 className="text-3xl font-bold">
                {monitor.confidence}%
              </h3>
            </div>

          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Signal Quality
          </h2>

          <div className="space-y-6">

            <div className="w-full bg-slate-700 rounded-full h-4">

              <div
                className="bg-cyan-400 h-4 rounded-full transition-all duration-500"
                style={{ width: signal.width }}
              />

            </div>

            <h3 className={`text-3xl font-bold ${signal.color}`}>
              {signal.text}
            </h3>

            <p className="text-slate-300">
              RSSI:
              <span className="font-bold text-white">
                {" "}
                {monitor.rssi} dBm
              </span>
            </p>

            <p className="text-slate-300">
              Packet Rate:
              <span className="font-bold text-white">
                {" "}
                {monitor.packetRate} pkt/s
              </span>
            </p>

          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Monitoring Status
          </h2>

          <div className="space-y-5">

            <p>
              🟢 Device Connected
            </p>

            <p>
              📡 CSI Streaming Active
            </p>

            <p>
              🤖 Guardian AI Running
            </p>

            <p>
              📊 Live Monitoring Enabled
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8">
        <CsiChart amplitudes={csiAmplitudes} />
      </div>

    </main>
  );
}
