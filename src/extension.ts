import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import PluginHeartbeat from './data/PluginHeartbeat';
import CodeHeartbeat from './data/CodeHeartbeat';
import { EventContext } from './Types';

export const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("Programming Wrapped");

export function activate(context: vscode.ExtensionContext) {
	outputChannel.appendLine("🔥 | Starting Extension");
	PluginHeartbeat(context);
	CodeHeartbeat(context);

	const eventsFolderPath = path.join(__dirname, 'events');
    fs.readdir(eventsFolderPath, (err, files) => {
        if (err) {
            outputChannel.appendLine(`❌ | Error reading events folder: ${err.message}`);
            return;
        }

		files = files.filter(file => file.endsWith('.js'));

        files.forEach(async file => {
            outputChannel.appendLine(`📁 | Registering event: ${file}`);
			const event: EventContext = require(path.join(eventsFolderPath, file));

			event(context);
        });
    });
}

export function deactivate() {
	outputChannel.dispose();
}
