import { DeviceRegistry } from "./device-registry.js";
import { SessionManager } from "./session-manager.js";
import { GuardianStateManager } from "./guardian-state-manager.js";
import { GuardianAgent } from "./guardian-agent.js";
import { GuardianAI } from "./guardian-ai.js";
import { updateLiveVitals } from "./live-state.js";
import { websocketServer } from "../api/context";
import { updateMonitorState } from "./monitor-state.js";
import { updateAlert } from "./alert-state.js";
export interface GuardianBridgeMessage {

  deviceId: string;

  timestamp: string;

  rawPacket: any;

}

export class GuardianCore {

  constructor(
    private deviceRegistry: DeviceRegistry,
    private sessionManager: SessionManager,
    private stateManager: GuardianStateManager
  ) {}
  private guardianAgent = new GuardianAgent();
  private guardianAI = new GuardianAI();

  processBridgeMessage(message: GuardianBridgeMessage) {
    console.log("Bridge Packet:", message);

    const analysis = this.guardianAI.analyze(message.rawPacket);
    if (analysis.risk === "High") {

  updateAlert({
    active: true,
    title: "High Risk Detected",
    message: "Respiration is outside the safe range.",
    severity: "high",
    time: new Date().toLocaleTimeString(),
  });

} else {

  updateAlert({
    active: false,
    title: "",
    message: "",
    severity: "low",
    time: "",
  });

}
// Store latest vitals including CSI
updateLiveVitals({
  ...analysis,
  csi: message.rawPacket.csi,
});

// Update monitoring state
updateMonitorState({
  packetRate: 240,
  rssi: message.rawPacket.rssi,
  activity: analysis.motion,
  respiration: analysis.respiration,
  confidence: analysis.confidence,
});

console.log("Guardian AI:", analysis);
console.log("CSI Length:", message.rawPacket.csi.length);

// Broadcast live update
websocketServer.broadcast({
  event: "LIVE_UPDATE",
  data: {
    ...analysis,
    csi: message.rawPacket.csi,
  },
});

    this.deviceRegistry.updateHeartbeat(message.deviceId);

    this.stateManager.updateState({
      connectedDevices: this.deviceRegistry.getAllDevices().length,
      activeSessions: this.sessionManager
        .getAllSessions()
        .filter(session => session.monitoring).length
    });
console.log("Received Guardian Bridge packet");

console.log(message);

return {
    processed: true,
    deviceId: message.deviceId,
    analysis
};
  }

}