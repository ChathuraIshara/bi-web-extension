import {
    ProtocolConnection,
} from "vscode-languageserver-protocol";
import * as rpc from "vscode-ws-jsonrpc";
import { LSConnection } from "./LSConnection";
// tslint:disable-next-line: no-var-requires
const WebSocket = require("isomorphic-ws");

export class WSConnection implements LSConnection {

    public static initialize(url: string): Promise<WSConnection> {
        return new Promise((resolve, reject) => {
            const webSocket = new WebSocket(url);
            rpc.listen({
                onConnection: (connection: rpc.MessageConnection) => {
                    resolve(new WSConnection(connection, webSocket));
                },
                webSocket,
            });
        });
    }

    // tslint:disable-next-line: variable-name
    private _connection: ProtocolConnection;
    // tslint:disable-next-line: variable-name
    private _webSocket: WebSocket;

    private constructor(connection: any, webSocket: any) {
        this._connection = connection;
        this._webSocket = webSocket;
    }

    public stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._webSocket.close();
            } catch (error) {
                reject(error);
            }
            resolve();
        });
    }

    public getProtocolConnection(): ProtocolConnection {
        return this._connection;
    }

}
