/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { SqFlow } from "@wso2-enterprise/ballerina-core";
import { Diagram } from "@wso2-enterprise/sequence-diagram";
import styled from "@emotion/styled";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
import { STNode } from "@wso2-enterprise/syntax-tree";
const Container = styled.div`
    width: 100%;
    height: calc(100vh - 50px);
    position: relative;
`;

const ExperimentalLabel = styled.div`
    position: fixed;
    top: 120px;
    left: 12px;
    background-color: ${ThemeColors.SURFACE_DIM};
    color: ${ThemeColors.ON_SURFACE};
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    z-index: 1000;
`;

const MessageContainer = styled.div({
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

interface BISequenceDiagramProps {
    syntaxTree: STNode; // INFO: this is used to make the diagram rerender when code changes
    onUpdate: () => void;
    onReady: () => void;
}

export function BISequenceDiagram(props: BISequenceDiagramProps) {
    const { syntaxTree, onUpdate, onReady } = props;

    const { rpcClient } = useRpcContext();
    const [flowModel, setModel] = useState<SqFlow>(undefined);

    useEffect(() => {
        getSequenceModel();
    }, [syntaxTree]);

    const getSequenceModel = () => {
        onUpdate();
        rpcClient
            .getSequenceDiagramRpcClient()
            .getSequenceModel()
            .then((model) => {
                if (model && "participants" in model.sequenceDiagram) {
                    setModel(model.sequenceDiagram);
                }
                // TODO: handle SequenceModelDiagnostic
            })
            .finally(() => {
                // onReady();
            });
    };

    console.log(">>> visualizer: flow model", flowModel);

    return (
        <>
            <Container>
                <ExperimentalLabel>Experimental</ExperimentalLabel>
                {flowModel && (
                    <Diagram
                        model={flowModel}
                        onClickParticipant={() => {}}
                        onAddParticipant={() => {}}
                        onReady={onReady}
                    />
                )}
                {!flowModel && <MessageContainer>Loading sequence diagram ...</MessageContainer>}
            </Container>
        </>
    );
}
