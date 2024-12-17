import * as vscode from 'vscode';
import { EventContext } from '../Types';
import { outputChannel } from '../extension';

const ToggleHeartbeatView: EventContext = (context: vscode.ExtensionContext) => {
    outputChannel.appendLine("✅ | Registered ToggleHeartbeatView");

    const heartbeatBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
    heartbeatBar.text = `♥ ${context.globalState.get<number>(`heartbeats`, 0)}`;
    heartbeatBar.tooltip = 'Number of heartbeats for programming wrapped';

    if(context.globalState.get<boolean>(`showHeartbeatView`, false)) {
        heartbeatBar.show();
    }

    vscode.commands.registerCommand('programming-wrapped.toggle_heartbeat_view', () => {
        context.globalState.update(`showHeartbeatView`, !context.globalState.get<boolean>(`showHeartbeatView`, false));
        if(context.globalState.get<boolean>(`showHeartbeatView`, false)) {
            heartbeatBar.show();
        } else {
            heartbeatBar.hide();
        }

        vscode.window.showInformationMessage(`Heartbeat view is now ${context.globalState.get<boolean>(`showHeartbeatView`, false) ? 'visible' : 'hidden'}`);
    });

    setInterval(() => {
        heartbeatBar.text = `♥ ${context.globalState.get<number>(`heartbeats`, 0)}`;
    }, 60 * 1000);
};

module.exports = ToggleHeartbeatView;