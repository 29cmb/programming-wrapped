import * as vscode from 'vscode';
import { outputChannel } from '../extension';

export default (context: vscode.ExtensionContext) => {
    outputChannel.appendLine("📨 | Starting PluginHeartbeat");

    setInterval(() => {
        CodeHeartbeatChecker(context);
        LanguageHeartbeatChecker(context);
    }, 10 * 60 * 1000);
};

function CodeHeartbeatChecker(context: vscode.ExtensionContext){
    outputChannel.appendLine("💔 | Checking for old code heartbeats");
    var oldHeartbeats = context.globalState.get<Array<Number>>(`yearHeartbeats`, []);
    var newHeartbeats = context.globalState.get<Array<Number>>(`yearHeartbeats`, []);

    newHeartbeats.filter(item => {
        return Date.now() - Number(item) < 1000 * 60 * 60 * 24 * 365;
    });

    context.globalState.update(`yearHeartbeats`, newHeartbeats);
    if(oldHeartbeats.length !== newHeartbeats.length) {
        context.globalState.update(`heartbeats`, context.globalState.get<number>(`heartbeats`, 0) - 1);
        outputChannel.appendLine("💔 | Removing old code heartbeats");
    }
}

function LanguageHeartbeatChecker(context: vscode.ExtensionContext){
    outputChannel.appendLine("💔 | Checking for old language heartbeats");
    var oldHeartbeats = context.globalState.get<Array<{name: string, time: number}>>(`languageHeartbeats`, []);
    var newHeartbeats = context.globalState.get<Array<{name: string, time: number}>>(`languageHeartbeats`, []);

    newHeartbeats.filter(item => {
        return Date.now() - Number(item.time) < 1000 * 60 * 60 * 24 * 365;
    });

    context.globalState.update(`languageHeartbeats`, newHeartbeats);
    if(oldHeartbeats.length !== newHeartbeats.length) {
        outputChannel.appendLine("💔 | Removing old language heartbeats");
    }
}