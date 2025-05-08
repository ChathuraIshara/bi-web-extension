import {
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver-protocol";

let allDiagnostics: Diagnostic[] = [];

class DiagnosticsVisitor implements Visitor {
    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (node.typeData?.diagnostics){
            const diagnosticSet: Diagnostic[] = Array.from(node.typeData.diagnostics).map((val: any) => {
                return {
                    message: val.message,
                    severity: getSeverity(val.diagnosticInfo.severity) as DiagnosticSeverity,
                    range: undefined
                }
            })
            allDiagnostics.push(...diagnosticSet);
        }
    }
}

function getSeverity(severity: string) : number {
    switch (severity.toLowerCase()) {
        case "error":
            return 1;
        case "warning":
            return 2;
        case "information":
            return 3;
        case "hint":
            return 4;
        default:
            return 0;
    }
}

export function clearAllDiagnostics() {
    allDiagnostics = []
}

export function getAllDiagnostics() : Diagnostic[] {
    return allDiagnostics;
}

export const visitor = new DiagnosticsVisitor();
