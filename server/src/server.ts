import {
    InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentSyncKind,
  TextDocuments,
  TextDocumentsConfiguration,
  _Connection,
  createConnection,
} from "vscode-languageserver/node";
import { DocumentUri } from "vscode-languageserver-textdocument";

enum Provider {
  Hover,
  DocumentHighlight,
  TextDocumentSyncFull,
  TextDocumentSyncIncrease,
  TextDocumentSyncNone,
  Completion,
  SignatureHelp,
  DocumentFormatting,
}

class Capabilities {
  public config: InitializeResult;
  public lsp: LSPBuilder;
  constructor(lsp: LSPBuilder) {
    this.config = {
      capabilities: {},
    };
    this.lsp = lsp;
  }
  /**
   * add Provider
   */
  public add(provider: Provider): Capabilities {
    switch (provider) {
      case Provider.Hover:
        this.hover();
        break;
      case Provider.Completion:
        this.completion();
        break;
      case Provider.DocumentFormatting:
        this.format();
        break;
      case Provider.DocumentHighlight:
        this.high_light();
        break;
      case Provider.SignatureHelp:
        this.signature_help();
        break;
      case Provider.TextDocumentSyncFull:
        this.text_doc_syn(TextDocumentSyncKind.Full);
        break;
      case Provider.TextDocumentSyncIncrease:
        this.text_doc_syn(TextDocumentSyncKind.Incremental);
        break;
      case Provider.TextDocumentSyncNone:
        this.text_doc_syn(TextDocumentSyncKind.None);
        break;
      default:
        throw new Error(`can not match provider, see Enum Provider to check!`);
    }
    return this;
  }
  public hover() {
    Object.assign(this.config.capabilities, { hoverProvider: true });
    return this;
  }
  public completion() {
    Object.assign(this.config.capabilities, {
      completionProvider: {
        resolveProvider: true,
      },
    });
    return this;
  }
  public signature_help() {
    Object.assign(this.config.capabilities, {
      signatureHelpProvider: {
        triggerCharacters: ["("],
      },
    });
    return this;
  }
  public high_light() {
    Object.assign(this.config.capabilities, {
      documentHighlightProvider: true,
    });
    return this;
  }

  public format() {
    Object.assign(this.config.capabilities, {
      documentFormattingProvider: true,
    });
    return this;
  }
  public text_doc_syn(kind: TextDocumentSyncKind) {
    if (this.config.capabilities?.textDocumentSync) {
      this.config.capabilities.textDocumentSync = kind;
    } else {
      Object.assign(this.config.capabilities, {
        textDocumentSync: kind,
      });
    }

    return this;
  }
  public build() {
    this.lsp.build_capabilities(this.config);
    return this.lsp;
  }
}

/**
 * LSP Builder
 * ## no builder
 * ```typescript
 *  const connection = createConnection(ProposedFeatures.all);
 * 
 *  const target_doc = new TextDocuments(TextDocument);
 * 
 *  connection.onInitialize((_params: InitializeParams): InitializeResult => {
 *  const init_result: InitializeResult = {
 *      capabilities: {
 *      // syn highlight
 *      documentHighlightProvider: true,
 *      // hover tip
 *      hoverProvider: true,
 *      },
 *  };
 *  return init_result;
 *  });
 * 
 *  target_doc.listen(connection);
 * 
 *  connection.listen();shu
 * ```
 */
class LSPBuilder {
  public connection: _Connection<any>;
  public target: TextDocuments<any>;

  constructor() {
    this.connection = createConnection(ProposedFeatures.all);
  }

  public set_target<
    T extends {
      uri: DocumentUri;
    }
  >(configuration: TextDocumentsConfiguration<T>) {
    this.target = new TextDocuments(configuration);
    return this;
  }

  /**
   * init LSP capabilities
   * @returns : Capabilities
   */
  public init_capabilities(): Capabilities {
    return new Capabilities(this);
  }
  /**
   * It will be auto called after Capabilities.build()
   * @param config 
   */
  public build_capabilities(config: InitializeResult){
    this.connection.onInitialize((_params:InitializeParams):InitializeResult=>{
        
        return {
            ...config
        }
    })
  }
  /**
   * open listen
   * @returns : _Connection<any>
   */
  public listen() {
    this.target.listen(this.connection);
    this.connection.listen();

    return {
        connection: this.connection,
        target_doc: this.target
    };
  }
}

export { Provider, Capabilities, LSPBuilder };
