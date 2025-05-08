/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeModel } from "@projectstorm/react-diagrams";
import { Query, STNode } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { getNodeIdFromModel } from "../../utils/node";
import { NodePortModel } from "../NodePort/NodePortModel";
import { Colors, DATA_SERVICE_NODES, NodeTypes } from "../../resources/constants";
import { RpcClient } from '@wso2-enterprise/mi-rpc-client';
import { Diagnostic } from "vscode-languageserver-types";
import SidePanelContext from "../sidePanel/SidePanelContexProvider";
import styled, { StyledComponent } from "@emotion/styled";
import { Button } from "@wso2-enterprise/ui-toolkit";
import { getDSInputMappingsFromSTNode, getDSQueryFromSTNode, getDSTransformationFromSTNode, getDSOutputMappingsFromSTNode } from "../../utils/template-engine/mustach-templates/dataservice/ds";

export class BaseNodeModel extends NodeModel {
    readonly stNode: STNode;
    protected portIn: NodePortModel;
    protected portOut: NodePortModel;
    protected parentNode: STNode;
    protected prevNodes: STNode[];
    readonly documentUri: string;
    readonly mediatorName: string;

    constructor(type: NodeTypes, mediatorName: string, documentUri: string, stNode: STNode, parentNode?: STNode, prevNodes: STNode[] = []) {
        super({
            id: stNode.viewState?.id || getNodeIdFromModel(stNode, type === NodeTypes.START_NODE ? "start" : undefined),
            type: type,
            locked: true,
        });
        this.stNode = stNode;
        this.parentNode = parentNode;
        this.prevNodes = prevNodes;
        this.addInPort("in");
        this.addOutPort("out");
        this.documentUri = documentUri;
        this.mediatorName = mediatorName;
    }

    addPort<T extends NodePortModel>(port: T): T {
        super.addPort(port);
        if (port.getOptions().in) {
            this.portIn = port;
        } else {
            this.portOut = port;
        }
        return port;
    }

    addInPort(label: string): NodePortModel {
        const p = new NodePortModel(true, label);
        return this.addPort(p);
    }

    addOutPort(label: string): NodePortModel {
        const p = new NodePortModel(false, label);
        return this.addPort(p);
    }

    getInPort(): NodePortModel {
        return this.portIn;
    }

    getOutPort(): NodePortModel {
        return this.portOut;
    }

    getStNode(): STNode {
        return this.stNode;
    }

    getParentStNode(): STNode {
        return this.parentNode;
    }

    getPrevStNodes(): STNode[] {
        return this.prevNodes;
    }

    async onClicked(e: any, node: BaseNodeModel, rpcClient: RpcClient, sidePanelContext: SidePanelContext, operationName: string = this.mediatorName, stNode: STNode = this.stNode) {
        e.stopPropagation();
        const nodeRange = { start: stNode.range.startTagRange.start, end: stNode.range?.endTagRange?.end ?? stNode.range.startTagRange.end };
        if (e.ctrlKey || e.metaKey) {
            // open code and highlight the selected node
            rpcClient.getMiDiagramRpcClient().highlightCode({
                range: nodeRange,
                force: true,
            });
        } else if (node.isSelected()) {
            // highlight the selected node
            rpcClient.getMiDiagramRpcClient().highlightCode({
                range: nodeRange,
            });

            let formData;
            if (Object.values(DATA_SERVICE_NODES).includes(operationName)) {
                switch (operationName) {
                    case DATA_SERVICE_NODES.INPUT:
                        formData = getDSInputMappingsFromSTNode(this.stNode as Query);
                        break;
                    case DATA_SERVICE_NODES.QUERY:
                        formData = getDSQueryFromSTNode(this.stNode as Query);
                        break;
                    case DATA_SERVICE_NODES.TRANSFORMATION:
                        formData = getDSTransformationFromSTNode(this.stNode as Query);
                        break;
                    case DATA_SERVICE_NODES.OUTPUT:
                        formData = getDSOutputMappingsFromSTNode(this.stNode as Query);
                }
            }

            sidePanelContext.setSidePanelState({
                ...sidePanelContext,
                isOpen: true,
                operationName,
                tag: stNode.tag,
                nodeRange: nodeRange,
                isEditing: true,
                parentNode: node.mediatorName,
                node: node,
                formValues: formData,
            });
        }
    }

    async delete(rpcClient: RpcClient, setDiagramLoading: (loading: boolean) => void) {
        setDiagramLoading(true);
        rpcClient.getMiDiagramRpcClient().applyEdit({
            documentUri: this.documentUri,
            range: {
                start: this.stNode.spaces.startingTagSpace.leadingSpace.range.start,
                end: this.stNode?.range?.endTagRange?.end ?? this.stNode.range.startTagRange.end
            },
            text: "",
            disableFormatting: true
        });
    };

    async addBreakpoint(rpcClient: any) {
        const request = {
            filePath: this.documentUri,
            breakpoint: {
                line: this.stNode.range.startTagRange.start.line,
                column: this.stNode.range.startTagRange.start?.character
            }
        };

        await rpcClient.getMiDebuggerRpcClient().addBreakpointToSource(request);
    }

    async removeBreakpoint(rpcClient: any) {
        const request = {
            filePath: this.documentUri,
            breakpoint: {
                line: this.stNode.range.startTagRange.start.line,
                column: this.stNode.range.startTagRange.start?.character
            }
        };

        await rpcClient.getMiDebuggerRpcClient().removeBreakpointFromSource(request);
    }

    hasDiagnotics(): boolean {
        return this.stNode.diagnostics !== undefined && this.stNode.diagnostics.length > 0;
    }

    getDiagnostics(): Diagnostic[] {
        return this.stNode.diagnostics || [];
    }

    hasBreakpoint(): boolean {
        return this.stNode.hasBreakpoint;
    }

    isActiveBreakpoint(): boolean {
        return this.stNode.isActiveBreakpoint;
    }

}

export const Content = styled.div`
    display: grid;
    position: absolute;
    left: 40px;
    top: 47%;
    transform: translateY(-50%);
`;

export const Header: StyledComponent<any, any, any> = styled.div<{ showBorder: boolean }>`
    color: ${Colors.ON_SURFACE};
    display: flex;
    width: 100%;
    margin-top: 2px;
    border-bottom: ${(props: { showBorder: any; }) => props.showBorder ? `0.2px solid ${Colors.OUTLINE_VARIANT};` : "none"};
    text-align: center;
`;

export const Body = styled.div<{}>`
    display: flex;
    max-width: 100%;
`;

interface DescriptionProps {
    selectable?: boolean;
};

export const Description: StyledComponent<any, any, any> = styled.div<DescriptionProps>`
    color: ${Colors.ON_SURFACE};
    max-width: 90px;
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align: left;
    font-family: var(--font-family);
    font-size: var(--type-ramp-minus1-font-size);

    &:hover {
        text-decoration: ${(props: DescriptionProps) => props.selectable ? "underline" : "none"};
        color: ${(props: DescriptionProps) => props.selectable ? Colors.SECONDARY : Colors.ON_SURFACE};
    }
`;

export const Name: StyledComponent<any, any, any> = styled(Description)`
    text-align: left;
    font-size: var(--type-ramp-base-font-size);
    font-weight: var(--font-weight);
`;

export const OptionsMenu = styled(Button)`
    background-color: ${Colors.SURFACE};
    border-radius: 5px;
    position: absolute;
    right: 6px;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
`;
