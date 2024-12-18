import { ExtensionContext, window } from "vscode"
import ms from "ms"

export const setGoal = (context: ExtensionContext, goal: string) => {
    let msGoal = ms(goal)
    if (isNaN(msGoal)) {
        window.showErrorMessage("Invalid goal")
        return;
    }

    if(msGoal < 0){
        msGoal = 0;
    }

    context.globalState.update('goal', msGoal)
    window.showInformationMessage(`Programming goal for this year set to ${goal}`)
}

export const getGoal = (context: ExtensionContext) : number => { 
    return context.globalState.get('goal', 0);
}

export const getGoalProgress = (context: ExtensionContext): number => {
    const msGoal: number = getGoal(context);
    const minutesGoal: number = msGoal / 60000;
    const heartbeats: number = context.globalState.get('heartbeats', 0);

    return clamp(heartbeats / minutesGoal, 0, 1);
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}