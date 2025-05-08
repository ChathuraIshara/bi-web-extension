import { monaco } from "react-monaco-editor";

import { initVisitor, PositioningVisitor, SizingVisitor } from "@wso2-enterprise/ballerina-low-code-diagram";
import { DiagramDiagnostic, DiagramEditorLangClientInterface, STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FunctionDefinition, ModulePart, ResourceAccessorDefinition, ServiceDeclaration, STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";

import { cleanLocalSymbols, cleanModuleLevelSymbols } from "../Diagram/visitors/symbol-finder-visitor";
import { SymbolVisitor } from "../index";
import { MESSAGE_TYPE, SelectedPosition } from "../types";

import { addExecutorPositions } from "./executor";

export async function getSyntaxTree(filePath: string, langClient: DiagramEditorLangClientInterface) {
    const resp = await langClient.getSyntaxTree({
        documentIdentifier: {
            uri: monaco.Uri.file(filePath).toString()
        }
    });
    return resp.syntaxTree;
}

export async function getFunctionSyntaxTree(filePath: string, range: any, langClient: DiagramEditorLangClientInterface) {
    const resp = await langClient.getSTForFunction({
        documentIdentifier: {
            uri: filePath
        },
        lineRange: range
    });
    return { syntaxTree: resp.syntaxTree, defFilePath: resp.defFilePath };
}


export async function resolveMissingDependencies(filePath: string, langClient: DiagramEditorLangClientInterface) {
    const resp = await langClient.resolveMissingDependencies({
        documentIdentifier: {
            uri: monaco.Uri.file(filePath).toString()
        }
    });
    return resp;
}

export async function getLowcodeST(payload: any, filePath: string, langClient: DiagramEditorLangClientInterface,
                                   experimentalEnabled?: boolean,
                                   showMessage?: (arg: string, messageType: MESSAGE_TYPE, ignorable: boolean,
                                                  filePath?: string, fileContent?: string, bypassChecks?: boolean) => void) {

    const st = sizingAndPositioningST(payload, experimentalEnabled, showMessage);
    cleanLocalSymbols();
    cleanModuleLevelSymbols();
    traversNode(st, SymbolVisitor);
    await addExecutorPositions(st, langClient, filePath)
    return st;
}

export function getFnStartPosition(node: FunctionDefinition | ResourceAccessorDefinition): SelectedPosition {
    const { startColumn, startLine } = node.functionName ? node.functionName.position : node.position;
    return {
        startColumn,
        startLine
    }
}
export function getDefaultSelectedPosition(modulePart: ModulePart): SelectedPosition {
    const functions = modulePart.members && modulePart.members.filter((m) => STKindChecker.isFunctionDefinition(m)) as FunctionDefinition[];
    const services = modulePart.members && modulePart.members.filter((m) => STKindChecker.isServiceDeclaration(m)) as ServiceDeclaration[];

    const mainResult = functions && functions.filter((m) => m.functionName.value === "main");
    if (mainResult && mainResult.length > 0) { // select main fn if availble
        return getFnStartPosition(mainResult[0]);
    } else if (services && services.length > 0) { // select first resource fn of first service if availble
        const resources = services[0].members;
        if (resources && resources.length > 0) {
            return getFnStartPosition(resources[0] as ResourceAccessorDefinition);
        }
    } else if (functions && functions.length > 0) { // select first fn if availble
        return getFnStartPosition(functions[0]);
    } else if (modulePart.members && modulePart.members.length > 0) { // select first member in module part
        const { startColumn, startLine } = modulePart.members[0]?.position;
        return { startColumn, startLine };
    } else {
        return { startColumn: 0, startLine: 0 };
    }
}

export function getSelectedPosition(modulePart: ModulePart, startLine: number, startColumn: number): SelectedPosition {
    if (modulePart.members && modulePart.members.length > 0) {
        let selectedNode: any;
        for (const member of modulePart.members) {
            if (STKindChecker.isServiceDeclaration(member)) {
                const isSelected = isNodeSelected({ startLine, startColumn }, member);
                if (isSelected) {
                    selectedNode = member;
                    break;
                }
            }
        }
        if (selectedNode && STKindChecker.isServiceDeclaration(selectedNode) && selectedNode.members && selectedNode.members.length > 0) {
            const resources = selectedNode.members;
            if (resources && resources.length > 0) {
                let selectedResourceNode: any;
                for (const resourceMember of resources) {
                    const isSelected = isNodeSelected({ startLine, startColumn }, resourceMember);
                    if (isSelected) {
                        selectedResourceNode = resourceMember;
                        break;
                    }
                }
                if (selectedResourceNode) {
                    return { startLine, startColumn };
                }
                return getFnStartPosition(resources[0] as ResourceAccessorDefinition);
            }
        }
    }
    return { startLine, startColumn };
}

export function isNodeSelected(selectedPosition: SelectedPosition, node: any): boolean {
    let lineOffset: number = 0;
    if (node?.leadingMinutiae && node?.leadingMinutiae.length > 0) {
        for (const minutiae of node.leadingMinutiae) {
            if (minutiae.kind === "END_OF_LINE_MINUTIAE") {
                lineOffset += 1;
            }
        }
    }

    return selectedPosition?.startLine >= (node.position?.startLine - lineOffset)
        && selectedPosition?.startLine <= node.position?.endLine;
}

export function sizingAndPositioningST(st: STNode, experimentalEnabled?: boolean,
                                       showMessage?: (arg: string, messageType: MESSAGE_TYPE, ignorable: boolean, filePath?: string, fileContent?: string, bypassChecks?: boolean) => void): STNode {
    traversNode(st, initVisitor);
    const sizingVisitor = new SizingVisitor(experimentalEnabled);
    traversNode(st, sizingVisitor);
    if (sizingVisitor.getConflictResulutionFailureStatus()) {
        showMessage("Something went wrong in the diagram rendering.", MESSAGE_TYPE.ERROR, false, undefined, undefined, true);
    }
    traversNode(st, new PositioningVisitor());
    const clone = { ...st };
    return clone;
}


export function isUnresolvedModulesAvailable(diagnostics: DiagramDiagnostic[]): { isAvailable: boolean, diagnostic: DiagramDiagnostic } {
    let unresolvedModuleAvailable: boolean = false;
    let selectedDiagnostic: DiagramDiagnostic;
    for (const diagnostic of diagnostics) {
        if (diagnostic.diagnosticInfo.code === "BCE2003") {
            unresolvedModuleAvailable = true;
            selectedDiagnostic = diagnostic;
            break;
        }
    }
    return { isAvailable: unresolvedModuleAvailable, diagnostic: selectedDiagnostic };
}

export function isDeleteModificationAvailable(modifications: STModification[]): boolean {
    let isAvailable = false;
    for (const modification of modifications) {
        if (modification.type.toLowerCase() === "delete") {
            isAvailable = true;
            break;
        }
    }
    return isAvailable;
}

export function getModifyPosition(modificationList: STModification[]): SelectedPosition {

    const contentModifications = modificationList.filter(modification => modification.type !== 'IMPORT');

    return contentModifications && contentModifications.length > 0 && {
        startLine: contentModifications[0].startLine + 1,
        startColumn: contentModifications[0].startColumn
    };
}
