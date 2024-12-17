import * as vscode from 'vscode';
import { outputChannel } from '../extension';
let lastHeartbeat = Date.now();

export default (context: vscode.ExtensionContext) => {
    outputChannel.appendLine("📨 | Starting CodeHeartbeat");
    setInterval(() => {
        if(Date.now() - lastHeartbeat > 60 * 1000) {
            context.globalState.update(`heartbeats`, context.globalState.get<number>(`heartbeats`, 0) + 1);
            context.globalState.update(`yearHeartbeats`, context.globalState.get<Array<Number>>(`yearHeartbeats`, []).push(Date.now()));
            outputChannel.appendLine("♥ | Adding new heartbeat to heartbearts and yearHeartbeats");
        }
    }, 60 * 1000);

    vscode.workspace.onDidSaveTextDocument(() => {
        lastHeartbeat = Date.now();
        outputChannel.appendLine("📁 | Document changed, updating heartbeat to " + lastHeartbeat);
    });
};