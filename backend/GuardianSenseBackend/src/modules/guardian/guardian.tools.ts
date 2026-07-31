import { ToolDecorator as Tool, ExecutionContext, z } from "@nitrostack/core";
import { SessionManager } from "../../services/session-manager.js";
import { DeviceRegistry } from "../../services/device-registry.js";
import { GuardianStateManager } from "../../services/guardian-state-manager.js";
export class GuardianTools {
  private sessionManager = new SessionManager();
  private deviceRegistry = new DeviceRegistry();
  private stateManager = new GuardianStateManager();
  @Tool({
  name: "get_system_status",
  description: "Returns GuardianSense backend status.",
  inputSchema: z.object({})
})
async getSystemStatus(input: any, ctx: ExecutionContext) {

  ctx.logger.info("System status requested");

  return this.stateManager.getState();
}
@Tool({
  name: "get_connected_devices",
  description: "Returns all registered Guardian Bridge devices.",
  inputSchema: z.object({})
})
async getConnectedDevices(input: any, ctx: ExecutionContext) {

  ctx.logger.info("Connected devices requested");

  return this.deviceRegistry.getAllDevices();

}
@Tool({
  name: "start_monitoring",
  description: "Starts a GuardianSense monitoring session.",
  inputSchema: z.object({
    deviceId: z.string().describe("Guardian Bridge device ID")
  })
})
async startMonitoring(input: any, ctx: ExecutionContext) {

  ctx.logger.info("Starting monitoring", {
    deviceId: input.deviceId
  });

  const session = this.sessionManager.createSession(input.deviceId);

  this.stateManager.updateState({
    monitoringActive: true,
    activeSessions: this.sessionManager.getAllSessions().length
  });

  return {
    success: true,
    session
  };
}
@Tool({
  name: "stop_monitoring",
  description: "Stops an active GuardianSense monitoring session.",
  inputSchema: z.object({
    sessionId: z.string().describe("Monitoring session ID")
  })
})
async stopMonitoring(input: any, ctx: ExecutionContext) {

  ctx.logger.info("Stopping monitoring", {
    sessionId: input.sessionId
  });

  const success = this.sessionManager.stopSession(input.sessionId);

  this.stateManager.updateState({
    monitoringActive: false,
    activeSessions: this.sessionManager.getAllSessions()
      .filter(session => session.monitoring).length
  });

  return {
    success
  };
}
}