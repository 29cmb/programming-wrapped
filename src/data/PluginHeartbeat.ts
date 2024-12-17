import * as vscode from 'vscode';
import { outputChannel } from '../extension';

export default (context: vscode.ExtensionContext) => {
    outputChannel.appendLine("📨 | Starting PluginHeartbeat");

    setInterval(() => {
        outputChannel.appendLine("💔 | Checking for old heartbeats");
        var oldHeartbeats = context.globalState.get<Array<Number>>(`yearHeartbeats`, []);
        var newHeartbeats = context.globalState.get<Array<Number>>(`yearHeartbeats`, []);

        newHeartbeats.filter(item => {
            return Date.now() - Number(item) < 1000 * 60 * 60 * 24 * 365;
        });

        context.globalState.update(`yearHeartbeats`, newHeartbeats);
        if(oldHeartbeats.length !== newHeartbeats.length) {
            context.globalState.update(`heartbeats`, context.globalState.get<number>(`heartbeats`, 0) - 1);
            outputChannel.appendLine("💔 | Removing old heartbeats");
        }
    }, 10 * 60 * 1000);
};