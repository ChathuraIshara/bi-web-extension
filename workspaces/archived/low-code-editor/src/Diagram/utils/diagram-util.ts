
import { FunctionViewState, initVisitor, PositioningVisitor, SizingVisitor } from "@wso2-enterprise/ballerina-low-code-diagram";
import { DiagramSize } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";

export function calculateSize(st: STNode): DiagramSize {
    return {
        height: 1000,
        width: 1000
    }
}

export function sizingAndPositioning(st: STNode, experimentalEnabled?: boolean): STNode {
    traversNode(st, initVisitor);
    traversNode(st, new SizingVisitor());
    traversNode(st, new PositioningVisitor());
    // traversNode(st, workerSyncVisitor);
    if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
        const viewState = st.viewState as FunctionViewState;
        traversNode(viewState.onFail, new SizingVisitor());
        traversNode(viewState.onFail, new PositioningVisitor());
    }
    const clone = { ...st };
    return clone;
}

export function recalculateSizingAndPositioning(st: STNode, experimentalEnabled?: boolean): STNode {
    traversNode(st, new SizingVisitor());
    traversNode(st, new PositioningVisitor());
    if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
        const viewState = st.viewState as FunctionViewState;
        traversNode(viewState.onFail, new SizingVisitor());
        traversNode(viewState.onFail, new PositioningVisitor());
    }
    const clone = { ...st };
    return clone;
}

