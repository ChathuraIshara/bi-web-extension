/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { EVENT_TYPE, MACHINE_VIEW, VisualizerLocation } from "@wso2-enterprise/mi-core";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { Codicon, Button } from "@wso2-enterprise/ui-toolkit";
import path from "path";
import { useEffect, useState } from "react";

interface Segment {
    label: string;
    onClick: () => void;
    isClickable: boolean;
}

export interface HierachicalPathProps {
}
export function HierachicalPath(props: HierachicalPathProps) {
    const { rpcClient } = useVisualizerContext();
    const [machineView, setMachineView] = useState<VisualizerLocation>(null);
    const [segments, setSegments] = useState<Segment[]>([]);

    useEffect(() => {
        try {
            rpcClient.getVisualizerState().then((mState) => {
                setMachineView(mState);
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (!machineView?.projectUri || !machineView?.documentUri || machineView.view === MACHINE_VIEW.Overview || !machineView?.pathSeparator) {
            return;
        }

        // Normalize paths to ensure compatibility across different platforms
        const normalizedProjectUri = path.normalize(machineView.projectUri);
        const normalizedDocumentUri = path.normalize(machineView.documentUri);

        const projectSrc = path.join(normalizedProjectUri, "src");
        const filePath = normalizedDocumentUri.split(projectSrc)[1];   
        const pathItems = filePath?.substring(1).split(machineView.pathSeparator);

        const segments: Segment[] = [];
        const updateSegments = async () => {

            if (!pathItems || pathItems.length === 0) {
                return;
            }

            for (const pathItem of pathItems) {
                if (pathItem.endsWith(".xml")) {
                    try {
                        const syntaxTree = await rpcClient.getMiDiagramRpcClient().getSyntaxTree({ documentUri: machineView.documentUri });
                        if (!syntaxTree || !syntaxTree?.syntaxTree || !syntaxTree.syntaxTree?.api) {
                            continue;
                        }
                        const api = syntaxTree.syntaxTree.api;
                        segments.push({
                            label: `${api.context}`,
                            onClick: () => {
                                rpcClient.getMiVisualizerRpcClient().openView({
                                    type: EVENT_TYPE.OPEN_VIEW,
                                    location: { view: MACHINE_VIEW.ServiceDesigner, documentUri: machineView.documentUri }
                                });
                            },
                            isClickable: true
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    segments.push({
                        label: pathItem,
                        onClick: () => { },
                        isClickable: false
                    });
                }
            }
            setSegments(segments);
        };
        updateSegments();
    }, [machineView]);

    return (
        segments.length === 0 ? <></> :
            <>
                <Codicon name="chevron-right" sx={{ paddingTop: "3px" }} />
                {segments.map((segment, index) => {
                    return <>
                        <Button appearance="icon" disabled={index === 0 || !segment.isClickable} onClick={segment.onClick}>
                            {segment.label}
                        </Button>
                        {index < segments.length - 1 && <Codicon name="chevron-right" sx={{ paddingTop: "2px" }} />}
                    </>

                })}
            </>
    );
}
