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

interface LiveData {
  respiration: number;
  motion: string;
  confidence: number;
  risk: string;
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

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/live");

        const historyRes = await axios.get(
          "http://localhost:5000/api/live-history"
        );

        const alertRes = await axios.get(
          "http://localhost:5000/api/alert"
        );

        setLive(res.data);
        setHistory(historyRes.data);
        setAlert(alertRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLive();

    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to Guardian WebSocket");
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.event === "LIVE_UPDATE") {
        setLive(message.data);

        setHistory((prev) => [
          ...prev.slice(-29),
          {
            time: Date.now(),
            respiration: message.data.respiration,
          },
        ]);

        try {
          const alertRes = await axios.get(
            "http://localhost:5000/api/alert"
          );

          setAlert(alertRes.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onerror = (err) => {
      console.error(err);
    };

    return () => socket.close();
  }, []);

  return (
    <main className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <section className="flex-1">
        <Navbar />

        <div className="p-8 pb-0">
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
          <RespirationChart data={history} />
        </div>
      </section>
    </main>
  );
}