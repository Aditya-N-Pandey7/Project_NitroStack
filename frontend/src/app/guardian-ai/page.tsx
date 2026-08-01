"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface LiveData {
  respiration: number;
  motion: string;
  confidence: number;
  risk: string;
}

export default function GuardianAIPage() {
  const [live, setLive] = useState<LiveData>({
    respiration: 0,
    motion: "Waiting...",
    confidence: 0,
    risk: "Unknown",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/live");
        setLive(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === "LIVE_UPDATE") {
        setLive(message.data);
      }
    };

    return () => socket.close();
  }, []);

  const getAIExplanation = () => {
    if (live.risk === "High") {
      return {
        summary: "Potential health concern detected.",
        reasoning:
          "Respiration is outside the expected range. Guardian AI recommends immediate attention and closer observation.",
        recommendation:
          "Notify caregiver and continue continuous monitoring.",
      };
    }

    if (live.motion === "Walking") {
      return {
        summary: "Normal walking activity detected.",
        reasoning:
          "CSI signal energy indicates sustained body movement while respiration remains stable.",
        recommendation:
          "Continue monitoring. No intervention is currently required.",
      };
    }

    return {
      summary: "Patient appears stationary.",
      reasoning:
        "Minimal body movement detected with respiration inside the expected healthy range.",
      recommendation:
        "Continue passive monitoring. No abnormal behavior detected.",
    };
  };

  const ai = getAIExplanation();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-2">
        Guardian AI
      </h1>

      <p className="text-slate-400 mb-10">
        Real-time AI Health Assessment
      </p>

      <div className="grid grid-cols-3 gap-8">

        {/* Current Assessment */}
        <div className="bg-slate-900 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Current Assessment
          </h2>

          <div className="space-y-5">
            <div>
              <span className="text-slate-400">Respiration</span>
              <h3 className="text-3xl font-bold">
                {live.respiration} BPM
              </h3>
            </div>

            <div>
              <span className="text-slate-400">Motion</span>
              <h3 className="text-3xl font-bold">
                {live.motion}
              </h3>
            </div>

            <div>
              <span className="text-slate-400">Confidence</span>
              <h3 className="text-3xl font-bold">
                {live.confidence}%
              </h3>
            </div>

            <div>
              <span className="text-slate-400">Risk</span>
              <h3 className="text-3xl font-bold text-cyan-400">
                {live.risk}
              </h3>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="bg-slate-900 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">
            AI Explanation
          </h2>

          <div className="space-y-6 leading-8 text-slate-300">

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Summary
              </h3>
              <p>{ai.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Reasoning
              </h3>
              <p>{ai.reasoning}</p>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Recommendation
              </h3>
              <p>{ai.recommendation}</p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}