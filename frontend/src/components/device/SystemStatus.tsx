"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Status {
  backendOnline: boolean;
  monitoringActive: boolean;
  connectedDevices: number;
  activeSessions: number;
}

export default function SystemStatus() {

  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {

    const load = () => {

      api.get("/status")
        .then(res => setStatus(res.data))
        .catch(console.error);

    };

    load();

    const timer = setInterval(load,1000);

    return () => clearInterval(timer);

  }, []);

  if (!status) {

    return (
      <div className="bg-slate-900 rounded-xl p-6 text-white">
        Loading backend...
      </div>
    );

  }

  return (

    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

      <h2 className="text-xl font-bold mb-5 text-white">
        System Status
      </h2>

      <div className="space-y-2 text-white">

        <p>Backend : {status.backendOnline ? "🟢 Online" : "🔴 Offline"}</p>

        <p>Monitoring : {status.monitoringActive ? "Running" : "Stopped"}</p>

        <p>Devices : {status.connectedDevices}</p>

        <p>Sessions : {status.activeSessions}</p>

      </div>

    </div>

  );

}