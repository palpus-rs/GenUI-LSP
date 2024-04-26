import path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  );

  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'gen' }],
    synchronize: {
      configurationSection: 'genLanguage',
      fileEvents: workspace.createFileSystemWatcher('**/.gen')
    }
  };

  client = new LanguageClient(
    'genLanguageServer',
    'Gen Language Server',
    serverOptions,
    clientOptions
  );

  client.start();
  context.subscriptions.push(client);
}
