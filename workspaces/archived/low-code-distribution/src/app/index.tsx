import { renderStandaloneMockedEditor } from "@wso2-enterprise/ballerina-low-code-editor";

(window as any).setImmediate = window.setTimeout;

renderStandaloneMockedEditor("low-code-container");
