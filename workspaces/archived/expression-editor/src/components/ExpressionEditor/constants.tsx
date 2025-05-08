import { CompletionItemKind } from "vscode-languageserver-protocol";

export const acceptedKind: CompletionItemKind[] = [
    // Operator
    24 as CompletionItemKind,
    // Value
    12 as CompletionItemKind,
    // Keyword
    14 as CompletionItemKind,
    // Property
    10 as CompletionItemKind,
    // Variable
    6 as CompletionItemKind,
    // Field
    5 as CompletionItemKind,
    // Method
    2 as CompletionItemKind,
    // Function
    3 as CompletionItemKind,
];

export const rejectedKinds: CompletionItemKind[] = [
    // Snippet
    15 as CompletionItemKind,
    // Module
    9 as CompletionItemKind,
];

export const TRIGGER_CHARACTERS: string[] = [".", " ", "(", ",", ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export const EXPAND_WIDGET_ID = "expand-widget";
export const COLLAPSE_WIDGET_ID = "collapse-widget";
export const CONFIGURABLE_WIDGET_ID = "configurable";
export const DOUBLE_QUOTE_ERR_CODE = "BCE0411";
export const UNDEFINED_SYMBOL_ERR_CODE = "BCE2010";

// BCE0411 = Missing quotes, BCE2010 = Undefined symbol, BCE0012 = Missing plus token, BCE0400 = missing identifier, BCE2066 =  incompatible types
export const SUGGEST_DOUBLE_QUOTES_DIAGNOSTICS = ["BCE0411", "BCE2010", "BCE0012", "BCE0400", "BCE2066"];

// BCE2066 =  incompatible types
export const INCOMPATIBLE_TYPE_ERR_CODE = "BCE2066";
export const INCOMPATIBLE_TYPE_MAP_ERR_CODE = "BCE2508"

export const SUGGEST_TO_STRING_TYPE = ["string", "record", "union", "int", "float", "boolean", "json", "xml", "var", "error", "any", "anydata", "decimal"];

export const EDITOR_MAXIMUM_CHARACTERS = 25;
export const EXPAND_EDITOR_MAXIMUM_CHARACTERS = 60;

/** Messages to be ignored when displaying diagnostics in expression editor */
export const IGNORED_DIAGNOSTIC_MESSAGES: string[] = [`invalid token ';'`];

export const DIAGNOSTIC_MAX_LENGTH = 125;

export const SUGGEST_CAST_MAP : {[name: string]: string[]} = {
    "int": ["string", "float", "decimal", "json", "any", "anydata"],
    "float": ["string", "int", "decimal", "json", "any", "anydata"],
    "decimal": ["string", "int", "float", "json", "any", "anydata"],
    "boolean": ["string", "json", "any", "anydata"],
    "xml": ["string"]
}

export const FILE_SCHEME = "file://";
export const EXPR_SCHEME = "expr://";
