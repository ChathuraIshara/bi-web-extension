export const keywords = [
    "public", "private", "remote", "abstract", "client", "import", "function", "const", "listener", "service",
    "xmlns", "annotation", "type", "record", "object", "version", "as", "on", "resource", "final", "source",
    "worker", "parameter", "field", "isolated", "returns", "return", "external", "true", "false", "if", "else",
    "while", "check", "checkpanic", "panic", "continue", "break", "typeof", "is", "null", "lock", "fork", "trap",
    "in", "foreach", "table", "key", "let", "new", "from", "where", "select", "start", "flush", "configurable",
    "wait", "do", "transaction", "transactional", "commit", "rollback", "retry", "enum", "base16", "base64",
    "match", "conflict", "limit", "join", "outer", "equals", "class", "order", "by", "ascending", "descending",
    "_", "!is", "int", "byte", "float", "decimal", "string", "boolean", "xml", "json", "handle", "any", "anydata",
    "never", "var", "map", "future", "typedesc", "error", "stream", "readonly", "distinct", "fail",
    "tainted", "untainted", "default"
]

// Currently int, string, boolean, collection is used in AI
export const symbolKind: Record<number, string> = {
    1: "file",
    2: "module",
    3: "namespace",
    4: "package",
    5: "class",
    6: "method",
    7: "property",
    8: "field",
    9: "constructor",
    10: "enum",
    11: "interface",
    12: "function",
    13: "variable",
    14: "constant",
    15: "string",
    16: "int", // This is either int, float or decimal
    17: "boolean",
    18: "array", // This is an Array
    19: "object",
    20: "key",
    21: "null",
    22: "enumMember",
    23: "struct",
    24: "event",
    25: "operator",
    26: "typeParameter"
}

// Tooltip messages
export const tooltipMessages: Record<string, any> = {
    path: {
        title: "Set the path to expose the API.",
        content: "/users/[string name]"
    },
    SMTP: {
        host: "The host address from your SMTP client configurations",
        username: "The username from your SMTP client configurations",
        password: "The password from your SMTP client configurations",
        from: "The email address of the sender",
        to: "The email address of the receiver(s)",
        subject: "The subject of the email",
        body: "The body of the email"
    },
    IMAP: {
        host: "The host address from your IMAP client configurations",
        username: "The username from your IMAP client configurations",
        password: "The password from your IMAP client configurations. \
        You need to set up an application password for your email account before using this connector. \
        Click the link below to set up an application password for a Gmail Account. \
        For other vendor accounts, see the vendor-specific documentation.",
        passwordLink: "https://support.google.com/mail/answer/185833?hl=en-GB",
        passwordText: "Click here"
    },
    POP3: {
        host: "The host address from your POP3 client configurations",
        username: "The username from your POP3 client configurations",
        password: "The password from your POP3 client configurations",
    },
    connectorButtons: {
        savaButton: "Save connector initialization",
        savaNextButton: "Configure connector invocation"
    },
    salesforce: {
        clientID: "The client ID of the connected app",
        clientSecret: "The client secret of the connected app",
        refreshToken: "The refresh token of the connected app",
        refreshTokenURL: "The refresh token URL of the connected app"
    }
}

export const connectorCategories = {
    GENERIC_CONNECTORS: "generic-connectors",
    SERVICE_CONNECTORS: "service-connectors",
    CHOREO_CONNECTORS: "choreo-connectors"
}

export const QUERY = 'query';
export const CATEGORY = 'category';
export const PAGE_OFFSET = 'pageOffset';
export const SORT_VALUE = 'sortValue';
export const FILTER_BY = 'filterBy';
