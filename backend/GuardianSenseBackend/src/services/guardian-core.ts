import { DeviceRegistry } from "./device-registry.js";
import { SessionManager } from "./session-manager.js";
import { GuardianStateManager } from "./guardian-state-manager.js";
import { GuardianAgent } from "./guardian-agent.js";
export interface GuardianBridgeMessage {
  deviceId: string;
  timestamp: string;
  breathingDetected: boolean;
  movementDetected: boolean;
}

export class GuardianCore {

  constructor(
    private deviceRegistry: DeviceRegistry,
    private sessionManager: SessionManager,
    private stateManager: GuardianStateManager
  ) {}
  private guardianAgent = new GuardianAgent();

  processBridgeMessage(message: GuardianBridgeMessage) {

    this.deviceRegistry.updateHeartbeat(message.deviceId);

    this.stateManager.updateState({
      connectedDevices: this.deviceRegistry.getAllDevices().length,
      activeSessions: this.sessionManager
        .getAllSessions()
        .filter(session => session.monitoring).length
    });

    const decision = this.guardianAgent.evaluate(
  message.breathingDetected,
  message.movementDetected
);

return {
  processed: true,
  deviceId: message.deviceId,
  decision
};
  }

}