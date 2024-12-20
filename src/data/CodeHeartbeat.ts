import * as vscode from 'vscode';
import { outputChannel } from '../extension';

let lastHeartbeat = Date.now();
let lastHeartbeatLanguage = "unknown";

const overrides: { [name: string]: string } = {
    "javascriptreact": "React (jsx)",
    "typescriptreact": "React (tsx)",
    "plaintext": "Text files",
    "bat": "Batch files",
    "cpp": "C++",
    "csharp": "C#",
    "css": "CSS",
    "cuda-cpp": "CUDA",
    "dockerfile": "Docker",
    "fsharp": "F#",
    "html": "HTML",
    "json": "JSON",
    "jsonc": "JSON (comments)",
    "latex": "LaTeX",
    "objective-c": "Objective-C",
    "objective-cpp": "Objective-C++",
    "ocaml": "OCaml",
    "php": "PHP",
    "scss": "SCSS",
    "sql": "SQL",
    "vb": "Visual Basic",
    "xml": "XML",
    "yaml": "YAML",
    "shellscript": "Shell script",
    "powershell": "PowerShell",
    "vue-html": "Vue HTML",
    "xsl": "XSL"
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
                const languageHeartbeats = context.globalState.get<Array<{name: string, time: number}>>('languageHeartbeats', []);
                languageHeartbeats.push({name: lastHeartbeatLanguage, time: currentTime});

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
    const languageHeartbeats = context.globalState.get<Array<{name: string, time: number}>>('languageHeartbeats', []);
    if (languageHeartbeats.length === 0) {
        return "None";
    }

    const languageCounts: { [name: string]: number } = {};

    languageHeartbeats.forEach((languageHeartbeat) => {
        if (languageCounts[languageHeartbeat.name]) {
            languageCounts[languageHeartbeat.name] += 1;
        } else {
            languageCounts[languageHeartbeat.name] = 1;
        }
    });

    let mostUsedLanguage = "None";
    let mostUsedLanguageCount = 0;
    Object.keys(languageCounts).forEach((language) => {
        if (languageCounts[language] > mostUsedLanguageCount) {
            mostUsedLanguage = language;
            mostUsedLanguageCount = languageCounts[language];
        }
    });

    return mostUsedLanguage;
};

export const getLanguageTime = (context: vscode.ExtensionContext, language: string): number => {
    const languageHeartbeats = context.globalState.get<Array<{name: string, time: number}>>('languageHeartbeats', []);
    if (languageHeartbeats.length === 0) {
        return 0;
    }

    let languageTime = 0;
    languageHeartbeats.forEach((languageHeartbeat) => {
        if (languageHeartbeat.name === language) {
            languageTime += 1;
        }
    });

    return languageTime;
}