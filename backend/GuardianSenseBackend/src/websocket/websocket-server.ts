import { WebSocketServer } from "ws";

export class GuardianWebSocketServer {

    private wss: WebSocketServer;

    constructor(port = 8080) {

        this.wss = new WebSocketServer({ port });

        console.log(`Guardian WebSocket running on ws://localhost:${port}`);

    }

    broadcast(data: unknown) {

        const message = JSON.stringify(data);

        this.wss.clients.forEach(client => {

            if (client.readyState === client.OPEN) {
                client.send(message);
            }

        });

    }

}