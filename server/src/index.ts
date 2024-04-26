import { TextDocument } from "vscode-languageserver-textdocument";
import { LSPBuilder, Provider } from "./server";
import {
  DocumentHighlightKind,
  DocumentHighlightParams,
  DocumentHighlight,
} from "vscode-languageserver";

const { connection, target_doc } = new LSPBuilder()
  .set_target(TextDocument)
  .init_capabilities()
  .add(Provider.Hover)
  .add(Provider.DocumentHighlight)
  .build()
  .listen();

// connection.onDocumentHighlight(
//   (params: DocumentHighlightParams): Promise<DocumentHighlight[]> => {
//     const { textDocument } = params;
//     const doc: TextDocument = target_doc.get(textDocument.uri)!;
//     const doc_text = doc.getText();
//     const pattern = /\btemplate\b/i;
//     const high_lights: DocumentHighlight[] = [];
//     let match;
//     while ((match = pattern.exec(doc_text))) {
//       high_lights.push({
//         range: {
//           start: doc.positionAt(match.index),
//           end: doc.positionAt(match.index + match[0].length),
//         },
//         kind: DocumentHighlightKind.Write,
//       });
//     }
//     return Promise.resolve(high_lights);
//   }
// );
