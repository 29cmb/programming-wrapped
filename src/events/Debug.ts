import { EventContext } from "../Types";
import * as vscode from 'vscode'

const debug: EventContext = (context: vscode.ExtensionContext) => {
    vscode.commands.registerCommand("programming-wrapped.set_hearbeats", async () => {
        const input = await vscode.window.showInputBox({
            prompt: "Enter password (ruins the fun)",
            placeHolder: "password"
        });

        if(input !== "pwdebug_193") return vscode.window.showErrorMessage("Invalid password");

        const heartbeatsInput = await vscode.window.showInputBox({
            prompt: "Amount",
            placeHolder: "1000"
        });

        if (heartbeatsInput === undefined || !parseInt(heartbeatsInput) || parseInt(heartbeatsInput) < 0) {
            return vscode.window.showErrorMessage("Invalid amount");
        }

        const heartbeats = parseInt(heartbeatsInput);
        context.globalState.update("heartbeats", heartbeats);
        vscode.window.showInformationMessage(`Heartbeats set to ${heartbeats}`);
    });
}

module.exports = debug;