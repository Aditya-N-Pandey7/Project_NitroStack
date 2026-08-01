export interface GuardianAnalysis {
  respiration: number;
  motion: string;
  confidence: number;
  risk: string;
}

export class GuardianAI {
  analyze(packet: any): GuardianAnalysis {
    const rssi = packet?.rssi ?? -90;
    const csi = packet?.csi ?? [];

    // Simple energy calculation
    const energy =
      csi.length > 0
        ? csi.reduce((sum: number, x: number) => sum + Math.abs(x), 0) / csi.length
        : 0;

    // Temporary heuristic
    const motion = energy > 25 ? "Walking" : "Still";

    const respiration = 12 + Math.floor((energy % 8));

    const confidence = Math.min(
      99,
      Math.max(60, Math.floor(70 + energy / 2))
    );

    const risk =
      respiration < 10 || respiration > 25
        ? "High"
        : motion === "Walking"
        ? "Low"
        : "Safe";

    return {
      respiration,
      motion,
      confidence,
      risk,
    };
  }
}
