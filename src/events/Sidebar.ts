import { CancellationToken, ExtensionContext, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window } from "vscode";
import { EventContext } from "../Types";
import { outputChannel } from "../extension";
import { getGoalProgress } from "../data/GoalsData";
import { getLanguageTime, getMostUsedLanguage } from "../data/CodeHeartbeat";

class WrappedSidebar implements WebviewViewProvider {
    public static readonly viewType = 'programmingWrapped.sidebarView';

    constructor(private readonly context: ExtensionContext) {}

    resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext, token: CancellationToken): Thenable<void> | void {
        outputChannel.appendLine("📁 | Resolving Sidebar");
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
        this.commandManager(webviewView.webview);
    }

    private getHtmlForWebview(webview: Webview): string {
        // styles
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'vscode.css'));
        const sidebarStyles = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'sidebar.css'));

        // scripts
        const scriptUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'sidebar.js'));
        const nonce = getNonce();

        // images
        const purpleCircleUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'purple_circle.png'));
        const greenCircleUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'green_circle.png'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${sidebarStyles}" rel="stylesheet">
                <title>Programming Wrapped</title>
            </head>
            <body>
                <div id="goal-container">
                    <div id="goal-circle">
                        <img src="${purpleCircleUri}" alt="Goal Circle" id="goal-img" />
                        <p id="goal">-</p>
                    </div>
                    <div id="goal-info">
                        <p><b>Large projects have large goals!</b></p>
                        <p id='goal-info-panel1'></p>
                    </div>
                </div>
                <div id="total-time">
                    <div id="total-time-circle">
                        <img src="${greenCircleUri}" alt="Total Time" id="total-img"/>
                        <p id="total-large">-</p>
                    </div>
                    <div id="total-time-info">
                        <p><b>Sometimes you need to look at the bigger picture!</b><p>
                        <p id="total-time-info-panel2"></p>
                    </div>
                </div>
                <div id="top-languages">
                    <h2>Your top language was<br><span id="top-language">-</span></h2>
                    <p>You spent a total of <code><span id="lang-hours">-</span></code> hours programming in this language! I mean, practices makes perfect!</p>
                </div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    private commandManager(webview: Webview) {
        setInterval(() => {
            webview.postMessage({
                command: 'getGoalProgress',
                goalProgress: getGoalProgress(this.context)
            });

            webview.postMessage({
                command: "hasGoal",
                hasGoal: this.context.globalState.get('goal', 0) !== 0
            })

            webview.postMessage({
                command: "getGoal",
                goal: this.context.globalState.get('goal', 0)
            })

            webview.postMessage({
                command: "getWorkTime",
                time: this.context.globalState.get("heartbeats", 0)
            })

            webview.postMessage({
                command: "getHeartbeats",
                heartbeats: this.context.globalState.get("heartbeats", 0)
            })

            webview.postMessage({
                command: "getMostUsedLanguage",
                mostUsed: getMostUsedLanguage(this.context)
            })

            webview.postMessage({
                command: "mostUsedLanguageHeartbeats",
                heartbeats: getLanguageTime(this.context, getMostUsedLanguage(this.context))
            })
        }, 1000)
    }
}

const Sidebar: EventContext = (context: ExtensionContext) => {
    const provider = new WrappedSidebar(context);
    context.subscriptions.push(
        window.registerWebviewViewProvider(WrappedSidebar.viewType, provider)
    );
    
    outputChannel.appendLine("✅ | Registered Sidebar");
};

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = Sidebar;