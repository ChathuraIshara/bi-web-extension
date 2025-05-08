// types related track lowcode events
export const ADD_STATEMENT = "editor-workspace-add-statement";
export const SAVE_STATEMENT = "editor-workspace-save-statement";

export const ADD_CONNECTOR = "editor-workspace-add-connector";
export const SAVE_CONNECTOR = "editor-workspace-save-connector";
export const LOAD_CONNECTOR_LIST = "editor-workspace-load-connector-list";
export const SEARCH_CONNECTOR = "editor-workspace-search-connector";
export const SAVE_CONNECTOR_INIT = "editor-workspace-save-connector-init";
export const SAVE_CONNECTOR_INVOKE = "editor-workspace-save-connector-invoke";
export const CONNECTOR_CLOSED = "editor-workspace-connector-form-closed";
export const DIAGRAM_MODIFIED = "editor-workspace-edit-diagram";
export const SELECT_CONNECTOR = "editor-workspace-select-connector";
export const DELETE_CONNECTOR = "editor-workspace-delete-connector";

export const ADD_CONFIGURABLE = "editor-workspace-add-configurable";

export const ADD_VARIABLE = "editor-workspace-add-variable";
export const SAVE_VARIABLE = "editor-workspace-save-variable";
export const ADD_OTHER_STATEMENT = "editor-workspace-add-other-statement";
export const SAVE_OTHER_STATEMENT = "editor-workspace-save-other-statement";

export const OPEN_LOW_CODE = "editor-workspace-open";

export type EVENT_NAME = typeof ADD_STATEMENT |
    typeof SAVE_STATEMENT | typeof ADD_CONNECTOR |
    typeof SAVE_CONNECTOR_INIT | typeof SAVE_CONNECTOR |
    typeof SAVE_CONNECTOR_INVOKE |
    typeof CONNECTOR_CLOSED | typeof ADD_VARIABLE | typeof SAVE_VARIABLE | typeof ADD_CONNECTOR | typeof SAVE_CONNECTOR |
    typeof ADD_OTHER_STATEMENT | typeof SAVE_OTHER_STATEMENT | typeof SEARCH_CONNECTOR | typeof ADD_CONFIGURABLE |
    typeof OPEN_LOW_CODE | typeof DIAGRAM_MODIFIED | typeof LOAD_CONNECTOR_LIST | typeof SELECT_CONNECTOR | typeof DELETE_CONNECTOR;

export interface LowcodeEvent {
    /** Name of the app insights event */
    type: EVENT_NAME;
    name?: string;
    /** scope property within custom dimensions */
    connectorName?: string;
    /** Custom dimensions sent to app insights */
    property?: { [key: string]: string };
    /** Custom measurements sent to app insights */
    measurements?: { [key: string]: number; };
}
