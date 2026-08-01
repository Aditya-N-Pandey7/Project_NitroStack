"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MetricCard from "@/components/cards/MetricCard";
import SystemStatus from "@/components/device/SystemStatus";
import DeviceList from "@/components/device/DeviceList";
import RespirationChart from "@/components/charts/RespirationChart";
import AlertBanner from "@/components/alerts/AlertBanner";
import CsiChart from "@/components/charts/CsiChart";
import { useWebSocket } from "@/hooks/useWebSocket";

interface LiveData {
  respiration: number;
  motion: string;
  confidence: number;
  risk: string;
}

interface LiveUpdateData extends LiveData {
  csi: number[];
  packetRate: number;
  rssi: number;
}

interface AlertData {
  active: boolean;
  title: string;
  message: string;
}

interface HistoryPoint {
  time: number;
  respiration: number;
}

export default function Home() {
  const [live, setLive] = useState<LiveData>({
    respiration: 0,
    motion: "Waiting...",
    confidence: 0,
    risk: "Unknown",
  });

  const [history, setHistory] = useState<HistoryPoint[]>([]);

  const [alert, setAlert] = useState<AlertData>({
    active: false,
    title: "",
    message: "",
  });

  const [csiAmplitudes, setCsiAmplitudes] = useState<number[]>([]);
  const [packetRate, setPacketRate] = useState(0);
  const [rssi, setRssi] = useState(0);

  const { connected } = useWebSocket<LiveUpdateData>({
    onMessage: (message) => {
      setLive({
        respiration: message.respiration,
        motion: message.motion,
        confidence: message.confidence,
        risk: message.risk,
      });

      setCsiAmplitudes(message.csi ?? []);
      setPacketRate(message.packetRate ?? 0);
      setRssi(message.rssi ?? 0);

      setHistory((prev) => [
        ...prev.slice(-29),
        {
          time: Date.now(),
          respiration: message.respiration,
        },
      ]);

      axios
        .get("http://localhost:5000/api/alert")
        .then((res) => setAlert(res.data))
        .catch(console.error);
    },
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/live")
      .then((res) => setLive(res.data))
      .catch(console.error);
    axios
      .get("http://localhost:5000/api/live-history")
      .then((res) => setHistory(res.data))
      .catch(console.error);
    axios
      .get("http://localhost:5000/api/alert")
      .then((res) => setAlert(res.data))
      .catch(console.error);
  }, []);

  return (
    <main className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <section className="flex-1">
        <Navbar />

        <div className="p-8 pb-0">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                connected ? "bg-emerald-400" : "bg-red-500"
              }`}
            />
            {connected ? "Live feed connected" : "Reconnecting..."}
            <span className="ml-4">
              Packet rate: <span className="text-white">{packetRate} pkt/s</span>
            </span>
            <span className="ml-4">
              RSSI: <span className="text-white">{rssi} dBm</span>
            </span>
          </div>

          <AlertBanner
            active={alert.active}
            title={alert.title}
            message={alert.message}
          />
        </div>

        <div className="grid grid-cols-4 gap-6 p-8">
          <MetricCard
            title="Respiration"
            value={`${live.respiration} bpm`}
          />

          <MetricCard
            title="Motion"
            value={live.motion}
          />

          <MetricCard
            title="Confidence"
            value={`${live.confidence}%`}
          />

          <MetricCard
            title="Risk"
            value={live.risk}
          />
        </div>

        <div className="grid grid-cols-2 gap-8 px-8 pb-8">
          <SystemStatus />
          <DeviceList />
        </div>

        <div className="px-8 pb-8">
          <CsiChart amplitudes={csiAmplitudes} />
        </div>

        <div className="px-8 pb-8">
          <RespirationChart data={history} />
        </div>
      </section>
    </main>
  );
}
