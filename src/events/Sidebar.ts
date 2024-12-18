import { CancellationToken, ExtensionContext, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window } from "vscode";
import { EventContext } from "../Types";
import { outputChannel } from "../extension";

class WrappedSidebar implements WebviewViewProvider {
    public static readonly viewType = 'programmingWrapped.sidebarView';

    constructor(private readonly context: ExtensionContext) {}

    resolveWebviewView(webviewView: WebviewView, _context: WebviewViewResolveContext, _token: CancellationToken): Thenable<void> | void {
        outputChannel.appendLine("📁 | Resolving Sidebar");
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    }

    private getHtmlForWebview(webview: Webview): string {
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'main.css'));
        const siebarStyles = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'resources', 'sidebar.css'));

        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <link href="${siebarStyles}" rel="stylesheet">
                <title>Programming Wrapped</title>
            </head>
            <body>
                <p>Your Programming Wrapped</p>
            </body>
            </html>`;
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