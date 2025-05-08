/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ActionInvocationFinder, FunctionViewState, initVisitor, positionVisitor, sizingVisitor } from "@wso2-enterprise/ballerina-low-code-diagram";
import {
    BallerinaConnectorInfo,
    BallerinaRecord,
    Connector,
    DiagramEditorLangClientInterface,
    FunctionDefinitionInfo
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {parentSetupVisitor as ParentSetupVisitor} from "@wso2-enterprise/ballerina-statement-editor";
import {
    BooleanLiteral,
    CallStatement, CaptureBindingPattern, ElseBlock, FunctionDefinition, IdentifierToken, IfElseStatement, LocalVarDecl,
    ModulePart, ModuleVarDecl, NodePosition, NumericLiteral, RemoteMethodCallAction, ResourceKeyword, ServiceDeclaration,
    STKindChecker,
    STNode, StringLiteral, traversNode
} from '@wso2-enterprise/syntax-tree';
import { subMinutes } from "date-fns";
import { Diagnostic } from 'vscode-languageserver-protocol';

import { getSTNodeForReference } from "../../DiagramViewManager/utils";
import { AnalyzePayloadVisitor } from "../visitors/analyze-payload-visitor";
import { clearAllDiagnostics, getAllDiagnostics, visitor as DiagnosticVisitor } from '../visitors/diagnostics-collector';
// import { BlockStatementFinder } from '../components/LowCodeDiagram/Visitors/block-statement-finder';

export const MAIN_FUNCTION = "main";

export interface Warning {
    type: string;
    message: string;
    position?: any;
}

export const getPathOfResources = (resources: any[] = []) => resources?.map((path: any) => path?.value || path?.source).join('');

const findResourceIndex = (resourceMembers: any, targetResource: any) => {
    const index = resourceMembers.findIndex(
        (m: any) => {
            const currentPath = getPathOfResources(m.relativeResourcePath);
            const currentMethodType = m?.functionName?.value;
            const targetPath = getPathOfResources(targetResource?.relativeResourcePath)
            const targetMethodType = targetResource?.functionName?.value;

            return currentPath === targetPath && currentMethodType === targetMethodType;
        }
    );
    return index || 0;
};

const findServiceForGivenResource = (serviceMembers: any, targetResource: any) => {
    const { functionName: tFunctionName, relativeResourcePath: tRelativeResourcePath, position: tPosition } = targetResource;
    const targetMethod = tFunctionName?.value;
    const targetPath = getPathOfResources(tRelativeResourcePath);
    const targetStartLine = tPosition?.startLine.toString();

    let service = serviceMembers[0];
    serviceMembers.forEach((m: any) => {
        const resources = m.members;
        const found = resources?.find((r: any) => {
            const { functionName, relativeResourcePath, position } = r;
            const method = functionName?.value;
            const path = getPathOfResources(relativeResourcePath);
            const startLine = position?.startLine.toString();
            const lineCheck = (targetStartLine && startLine) ? (targetStartLine === startLine) : true;
            return method === targetMethod && path === targetPath;

        });
        if (found) service = m;
    });

    return service;
}

export function getLowCodeSTFnSelected(mp: ModulePart, fncOrResource: any = null, fn: boolean = false) {
    // TODO: Simplify this code block.

    const modulePart: ModulePart = mp;
    let functionDefinition: FunctionDefinition;
    const members: STNode[] = modulePart?.members || [];

    if (fn) {
        // FunctionDefinition
        const fnMembers = members.filter((m: any) => (m.kind === "FunctionDefinition"));
        for (const node of fnMembers) {
            if (STKindChecker.isFunctionDefinition(node) && node.functionName.value === fncOrResource.functionName.value) {
                functionDefinition = node as FunctionDefinition;
                functionDefinition.configurablePosition = node.position;
                break;
            }
        }
    } else {
        const serviceMembers = members.filter((m: any) => (STKindChecker.isServiceDeclaration(m)));

        if (fncOrResource) {
            const serviceMember: STNode = findServiceForGivenResource(serviceMembers, fncOrResource);
            if (STKindChecker.isServiceDeclaration(serviceMember)) {
                const resourceMembers: STNode[] = serviceMember.members;

                let resourceIndex = 0;
                if (fncOrResource) {
                    const foundResourceIndex = findResourceIndex(resourceMembers, fncOrResource);
                    resourceIndex = foundResourceIndex > 0 ? foundResourceIndex : 0;
                }

                const resourceMember = resourceMembers[resourceIndex];

                if (resourceMember.kind === "ResourceAccessorDefinition"
                    || resourceMember.kind === "ObjectMethodDefinition"
                    || resourceMember.kind === "FunctionDefinition") {
                    const functionDef = resourceMember as FunctionDefinition;
                    functionDef.configurablePosition = serviceMember.position;
                    let isRemoteOrResource: boolean = false;

                    functionDef?.qualifierList?.forEach(qualifier => {
                        if (qualifier.kind === "ResourceKeyword"
                            || qualifier.kind === "RemoteKeyword") {
                            isRemoteOrResource = true;
                        }
                    });

                    if (isRemoteOrResource) {
                        functionDefinition = resourceMember as FunctionDefinition;
                        functionDefinition.kind = "FunctionDefinition";
                    }
                }
            }
        } else {
            for (const node of serviceMembers) {
                if (STKindChecker.isServiceDeclaration(node)) {
                    // TODO: Fix with the ST interface generation.
                    const serviceDec = node as any;
                    const resourceMembers: STNode[] = serviceDec.members;

                    for (const resourceMember of resourceMembers) {
                        if (resourceMember.kind === "ResourceAccessorDefinition"
                            || resourceMember.kind === "ObjectMethodDefinition"
                            || resourceMember.kind === "FunctionDefinition") {
                            const functionDef = resourceMember as FunctionDefinition;
                            functionDef.configurablePosition = node.position;
                            let isRemoteOrResource: boolean = false;

                            functionDef?.qualifierList?.forEach(qualifier => {
                                if (qualifier.kind === "ResourceKeyword"
                                    || qualifier.kind === "RemoteKeyword") {
                                    isRemoteOrResource = true;
                                }
                            });

                            if (isRemoteOrResource) {
                                functionDefinition = resourceMember as FunctionDefinition;
                                functionDefinition.kind = "FunctionDefinition";
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    return functionDefinition ? functionDefinition : mp;
}

export function getLowCodeSTFn(mp: ModulePart) {
    const modulePart: ModulePart = mp;
    const members: STNode[] = modulePart.members;
    let functionDefinition: FunctionDefinition;
    for (const node of members) {
        if (STKindChecker.isFunctionDefinition(node) && node.functionName.value === MAIN_FUNCTION) {
            functionDefinition = node as FunctionDefinition;
            functionDefinition.configurablePosition = node.position;
            break;
        } else if (STKindChecker.isServiceDeclaration(node)) {
            // TODO: Fix with the ST interface generation.
            const serviceDec = node as any;
            const serviceMembers: STNode[] = serviceDec.members;
            for (const serviceMember of serviceMembers) {
                if (serviceMember.kind === "ResourceAccessorDefinition"
                    || serviceMember.kind === "ObjectMethodDefinition"
                    || serviceMember.kind === "FunctionDefinition") {
                    const functionDef = serviceMember as FunctionDefinition;
                    functionDef.configurablePosition = node.position;
                    let isRemoteOrResource: boolean = false;

                    functionDef?.qualifierList?.forEach(qualifier => {
                        if (qualifier.kind === "ResourceKeyword"
                            || qualifier.kind === "RemoteKeyword") {
                            isRemoteOrResource = true;
                        }
                    });

                    if (isRemoteOrResource) {
                        functionDefinition = serviceMember as FunctionDefinition;
                        functionDefinition.kind = "FunctionDefinition";
                        break;
                    }
                }
            }
            break;
        }
    }
    return functionDefinition ? functionDefinition : mp;
}

export function getDiagnosticsFromVisitor(st: ModulePart): Diagnostic[] {
    clearAllDiagnostics()
    traversNode(st, DiagnosticVisitor);
    const allDiagnostics = getAllDiagnostics();
    return allDiagnostics;
}


export function checkEmptyBasePath(modulePart: ModulePart): Warning[] {
    const members: STNode[] = modulePart.members;
    const warnings: Warning[] = [];
    for (const member of members) {
        const node: STNode = member;
        if (STKindChecker.isServiceDeclaration(node)) {
            const serviceDef: ServiceDeclaration = node as ServiceDeclaration;
            if (serviceDef.absoluteResourcePath && serviceDef.absoluteResourcePath.length === 0) {
                warnings.push({ message: "Observability not supported for services with empty basepaths", type: "Empty Base Path", position: serviceDef.position });
            }
        }
    }
    return warnings;
}


export function getWarningsFromST(modulePart: ModulePart): Warning[] {
    const servicesWithEmptyBasePaths = checkEmptyBasePath(modulePart);
    return servicesWithEmptyBasePaths;
}

export async function getConnectorDefFromCache(connector: Connector) {
    // TODO: fix with connector api
    // const { org, module: mod, version, name } = connector;
    // let connectorDef;
    // try {
    //     const resp = await fetch(`/connectors/cache/${org}/${mod}/${version}/${name}/st.json`);
    //     connectorDef = resp && resp.status === 200 ? resp.json() : undefined;
    // } catch (error) {
    //     // IGNORE
    // }
    // return connectorDef;
}

export async function getRecordDefFromCache(record: BallerinaRecord) {
    const { org, module: mod, version, name } = record;
    let recordDef;
    try {
        const resp = await fetch(`/records/cache/${org}/${mod}/${version}/${name}/st.json`);
        recordDef = resp && resp.status === 200 ? resp.json() : undefined;
    } catch (error) {
        // IGNORE
    }
    return recordDef;
}

export async function getFormFieldFromFileCache(connector: Connector): Promise<Map<string, FunctionDefinitionInfo>> {
    // TODO: fix with connector api
    // if (!connector) {
    //     return undefined;
    // }

    // const { org, module, version, name, cacheVersion } = connector;
    // const functionDef: Map<string, FunctionDefinitionInfo> = new Map();
    // try {
    //     await fetch(`/connectors/cache/${org}/${module}/${version}/${name}/${cacheVersion || "0"}/fields.json`)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data) {
    //                 for (const [key, fieldsInfo] of Object.entries(data)) {
    //                     functionDef.set(key, fieldsInfo as FunctionDefinitionInfo);
    //                 }
    //             }
    //         });
    // } catch (error) {
    //     // IGNORE
    // }
    // return functionDef.size > 0 ? functionDef : undefined;
    return undefined;
}

export interface FormFieldCache {
    [key: string]: FormFiledCacheEntry
}

export interface FormFiledCacheEntry {
    [key: string]: FunctionDefinitionInfo,
}

export const CONNECTOR_CACHE = "CONNECTOR_CACHE";
export const CONNECTOR_LIST_CACHE = "CONNECTOR_LIST_CACHE";
export const TRIGGER_CACHE = "TRIGGER_CACHE";
export const TRIGER_LIST_CACHE = "TRIGGER_LIST_CACHE";
export interface ConnectorCache {
    [key: string]: BallerinaConnectorInfo;
}

// TODO: need to update local storage with persistent disk
export async function addConnectorToCache(connector: BallerinaConnectorInfo) {
    const { package: { organization, name: packageName, version }, name, id } = connector;
    const key = `${organization}_${packageName}_${name}_${version}_${id || "x"}`;

    const connectorsStr = localStorage.getItem(CONNECTOR_CACHE);
    let connectors: ConnectorCache = {};
    if (connectorsStr) {
        connectors = JSON.parse(connectorsStr);
    }
    connectors[key] = connector;
    try {
        localStorage.setItem(CONNECTOR_CACHE, JSON.stringify(connectors));
    } catch (error) {
        // TODO: need to handle error when adding connector cache
    }
}

export function getConnectorFromCache(connector: Connector): BallerinaConnectorInfo {
    if (connector) {
        const { package: { organization, name: packageName, version }, name, id } = connector;
        const key = `${organization}_${packageName}_${name}_${version}_${id || "x"}`;

        const connectorsStr = localStorage.getItem(CONNECTOR_CACHE);
        let connectors: ConnectorCache;
        if (connectorsStr) {
            connectors = JSON.parse(connectorsStr) as ConnectorCache;
            if (connectors.hasOwnProperty(key)) {
                return connectors[key];
            }
        }
    }
    return undefined;
}

// TODO: need to update local storage with persistent disk
export async function addConnectorListToCache(connectors: Connector[]) {
    localStorage.setItem(CONNECTOR_LIST_CACHE, JSON.stringify(connectors));
}

export function getConnectorListFromCache(): Connector[] {
    const connectorsStr = localStorage.getItem(CONNECTOR_LIST_CACHE);
    let connectors: Connector[] = [];
    if (connectorsStr) {
        connectors = JSON.parse(connectorsStr) as Connector[];
    }
    return connectors;
}

export function findActualEndPositionOfIfElseStatement(ifNode: IfElseStatement): any {
    let position: any;
    if (ifNode.elseBody) {
        const elseStmt: ElseBlock = ifNode.elseBody;
        if (STKindChecker.isIfElseStatement(elseStmt?.elseBody)) {
            position = findActualEndPositionOfIfElseStatement(elseStmt.elseBody as IfElseStatement);
        } else if (STKindChecker.isBlockStatement(elseStmt?.elseBody)) {
            position = elseStmt.elseBody.position;
        }
    }
    return position;
}

export function isSTActionInvocation(node: STNode): RemoteMethodCallAction {
    const actionFinder: ActionInvocationFinder = new ActionInvocationFinder();
    traversNode(node, actionFinder);
    return actionFinder.getIsAction();
}

export function isSTResourceFunction(node: FunctionDefinition): boolean {
    const qualifierList: ResourceKeyword[] = node.qualifierList ?
        node.qualifierList as ResourceKeyword[] : [];
    let resourceKeyword: ResourceKeyword;
    qualifierList.forEach((qualifier: STNode) => {
        if (qualifier.kind === "ResourceKeyword") {
            resourceKeyword = qualifier as ResourceKeyword;
        }
    });

    return (resourceKeyword !== undefined);
}

export function getCronFromUtcCron(utcCron: string): string {
    const cronSplit = utcCron?.split(" ", 5);
    if (getSchType(utcCron) === "Day") {
        const updateCronStartTime = new Date();
        updateCronStartTime.setHours(Number(cronSplit[1]));
        updateCronStartTime.setMinutes(Number(cronSplit[0]));

        const timezoneOffsetMinutes = subMinutes(new Date(updateCronStartTime), (new Date()).getTimezoneOffset()).getMinutes();
        const timezoneOffsetHours = subMinutes(new Date(updateCronStartTime), (new Date()).getTimezoneOffset()).getHours();

        return timezoneOffsetMinutes + " " + timezoneOffsetHours + " * * *";
    } else {
        return utcCron;
    }
}

export function getSchType(cron: string): string {
    const cronSplit = cron?.split(" ", 5);
    const count = cronSplit.filter(value => value === "*").length;

    if (cronSplit[1].includes("*/") && cronSplit[0] === "0") {
        return "Hour";
    } else if (cronSplit[0].includes("*/") && count === 4) {
        return "Minute";
    } else if (count === 3) {
        return "Day";
    } else if (count === 2) {
        return "Week";
    } else if (count === 1) {
        return "Month";
    } else {
        return "Custom";
    }
}

export function sizingAndPositioningST(st: STNode): STNode {
    traversNode(st, initVisitor);
    traversNode(st, sizingVisitor);
    traversNode(st, positionVisitor);
    if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
        const viewState = st.viewState as FunctionViewState;
        traversNode(viewState.onFail, sizingVisitor);
        traversNode(viewState.onFail, positionVisitor);
    }
    const clone = { ...st };
    return clone;
}

export function getAnalyzerRequestPayload(st: STNode) {
    const visitor = new AnalyzePayloadVisitor();
    traversNode(st, visitor);
    return visitor.getPayload();
}

export function recalculateSizingAndPositioningST(st: STNode): STNode {
    traversNode(st, sizingVisitor);
    traversNode(st, positionVisitor);
    if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
        const viewState = st.viewState as FunctionViewState;
        traversNode(viewState.onFail, sizingVisitor);
        traversNode(viewState.onFail, positionVisitor);
    }
    const clone = { ...st };
    return clone;
}

export function getVariableNameFromST(node: LocalVarDecl | ModuleVarDecl): string {
    return node?.typedBindingPattern?.bindingPattern?.source.trim();
}

export function getMethodCallFunctionName(model: CallStatement): string {
    if (STKindChecker.isFunctionCall(model.expression)) {
        return model.expression.functionName.source.trim();
    }
}

export function isEndpointNode(node: STNode): boolean {
    return node && (STKindChecker.isLocalVarDecl(node) || STKindChecker.isModuleVarDecl(node)) && node.typeData?.isEndpoint;
}

export function getVarNamePositionFromST(node: LocalVarDecl | ModuleVarDecl): NodePosition {
    return node?.typedBindingPattern?.bindingPattern?.position;
}

export function isLiteral(node: STNode): node is StringLiteral | NumericLiteral | BooleanLiteral {
    return node && (
            STKindChecker.isStringLiteral(node)
            || STKindChecker.isNumericLiteral(node)
            || STKindChecker.isBooleanLiteral(node)
        );
}

export async function getListenerSignatureFromMemberNode(fullST: STNode, functionNode: STNode,
                                                         langClient: DiagramEditorLangClientInterface,
                                                         filePath: string): Promise<string> {

    let listenerSignature: string
    traversNode(fullST, ParentSetupVisitor);
    const parentNode: STNode = functionNode.parent;
    if (STKindChecker.isServiceDeclaration(parentNode)) {
        const listenerExpression = parentNode.expressions[0];
        if (STKindChecker.isExplicitNewExpression(listenerExpression)) {
            listenerSignature = listenerExpression.typeData?.typeSymbol?.signature;
        } else {
            const listenerSTDecl = await getSTNodeForReference(filePath, listenerExpression.position, langClient);
            if (listenerSTDecl) {
                listenerSignature = listenerExpression.typeData?.typeSymbol?.signature;
            }
        }
    }
    return listenerSignature;
}
