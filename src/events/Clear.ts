import { commands, ExtensionContext, window } from "vscode";
import { EventContext } from "../Types";

const ClearEvent: EventContext = (context: ExtensionContext) => {
    commands.registerCommand("programming-wrapped.clear_heartbeats", async () => {
        const input = await window.showInputBox({
            prompt: "Are you sure you would like to clear all heartbeats?",
            placeHolder: "confirm"
        })

        if(input !== "confirm") return window.showErrorMessage("Invalid confirmation");
        
        context.globalState.update("heartbeats", 0);
        context.globalState.update("yearHeartbeats", []);
        context.globalState.update("languageHeartbeats", []);
    })
}

module.exports = ClearEvent;