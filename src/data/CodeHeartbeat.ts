import * as vscode from 'vscode';
import { outputChannel } from '../extension';

let lastHeartbeat = Date.now();
let lastHeartbeatLanguage = "unknown";

const overrides: { [name: string]: string } = {
    "javascriptreact": "React (jsx)",
    "typescriptreact": "React (tsx)",
    "plaintext": "Text files"
};

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default (context: vscode.ExtensionContext) => {
    outputChannel.appendLine("📨 | Starting CodeHeartbeat");

    setInterval(() => {
        outputChannel.appendLine("🕒 | Checking for heartbeat");
        const currentTime = Date.now();
        if ((currentTime - lastHeartbeat) <= 60 * 1000) {
            const currentHeartbeats = context.globalState.get<number>('heartbeats', 0) + 1;
            context.globalState.update('heartbeats', currentHeartbeats);

            let yearHeartbeats = context.globalState.get<number[]>('yearHeartbeats', []);
            if (!Array.isArray(yearHeartbeats)) {
                yearHeartbeats = [];
            }
            yearHeartbeats.push(currentTime);
            context.globalState.update('yearHeartbeats', yearHeartbeats);

            if (lastHeartbeatLanguage !== "unknown") {
                const languageHeartbeats = context.globalState.get<{ [name: string]: number }>('languageHeartbeats', {});
                if (languageHeartbeats[lastHeartbeatLanguage]) {
                    languageHeartbeats[lastHeartbeatLanguage]++;
                } else {
                    languageHeartbeats[lastHeartbeatLanguage] = 1;
                }

                context.globalState.update('languageHeartbeats', languageHeartbeats);
                lastHeartbeatLanguage = "unknown";
            }

            outputChannel.appendLine("♥ | Adding new heartbeat to heartbeats and yearHeartbeats");
            lastHeartbeat = currentTime;
        } else {
            outputChannel.appendLine(`🕒 | No heartbeat found: ${currentTime - lastHeartbeat}`);
        }
    }, 60 * 1000);

    vscode.workspace.onDidSaveTextDocument((event) => {
        lastHeartbeat = Date.now();
        outputChannel.appendLine("📁 | Document changed, updating heartbeat to " + lastHeartbeat);
        lastHeartbeatLanguage = overrides[event.languageId as string] || capitalizeFirstLetter(event.languageId);
        outputChannel.appendLine("📁 | Document changed, updating language to " + lastHeartbeatLanguage);
    });
};

export const getMostUsedLanguage = (context: vscode.ExtensionContext): string => {
    const languageHeartbeats: { [name: string]: number } = context.globalState.get<{ [name: string]: number }>('languageHeartbeats', {});
    if (Object.keys(languageHeartbeats).length === 0) {
        return "None";
    }
    return Object.keys(languageHeartbeats).reduce((a, b) => (languageHeartbeats[a] > languageHeartbeats[b] ? a : b));
};