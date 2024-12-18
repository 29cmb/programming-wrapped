import { setGoal } from "../data/GoalsData";
import { outputChannel } from "../extension";
import { EventContext } from "../Types";
import * as vscode from "vscode";

const goals: EventContext = (context) => {
    vscode.commands.registerCommand("programming-wrapped.set_goal", async () => {
        const input = await vscode.window.showInputBox({
            prompt: "Set your programming goal",
            placeHolder: "1000h"
        });

        if(!input) return vscode.window.showErrorMessage("Invalid goal");
        setGoal(context, input);
    });

    outputChannel.appendLine("🎯 | Registered Goals");
}

module.exports = goals;