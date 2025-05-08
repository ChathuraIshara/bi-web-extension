/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Dropdown, Codicon } from "@wso2-enterprise/ui-toolkit";
import { xml } from "@codemirror/lang-xml";
import { oneDark } from "@codemirror/theme-one-dark";
import { linter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";

const Container = styled.div({
    display: 'grid',
    alignItems: 'start',
    justifyContent: 'center',
    gap: 20,
}, (props: any) => ({
    gridTemplateColumns: '1fr 4fr ' + '0.2fr '.repeat(props["btn-count"]),
    marginTop: props["not-new"] ? 0 : 10,
    paddingBottom: props["not-new"] ? props["is-last"] ? 0 : 10 : 0,
    borderBottom: props["not-new"] ? props["is-last"] ? 0 : "1px solid #e0e0e0" : 0,
}));

const CodeMirrorContainer = styled.div({
    overflowX: 'scroll',
    marginTop: 2,
});

const Endpoint = ({ endpoint, handleEndpointChange, handleSave, onDeleteClick, index, last, path }: any) => {
    const [codemirrorErrors, setCodemirrorErrors] = useState<any[]>([]);
    const [changesOccured, setChangesOccured] = useState<boolean>(false);
    const [tempEndpoint, setTempEndpoint] = useState<any>(endpoint);
    const [endpoints, setEndpoints] = useState<any[]>([]);
    const { rpcClient } = useVisualizerContext();

    useEffect(() => {
        setChangesOccured(JSON.stringify(endpoint) !== JSON.stringify(tempEndpoint));
    }, [tempEndpoint, endpoint]);

    useEffect(() => {
        (async () => {
            const result = await rpcClient.getMiDiagramRpcClient().getAvailableResources({
                documentIdentifier: path,
                resourceType: "endpoint"
            });
            const endpointList = [
                ...result.resources.map((endpoint) => ({ value: endpoint.name })),
                ...result.registryResources.map((endpoint) => ({ value: endpoint.name }))
            ];
            setEndpoints(endpointList);
        })();
    });

    const endpointTypes = [
        { content: 'INLINE', value: 'inline' },
        { content: 'STATIC', value: 'static' },
    ];

    const handleChanges = (field: string, value: any) => {
        const newEndpoint = { ...tempEndpoint, [field]: value };
        setTempEndpoint(newEndpoint);
        setChangesOccured(false);

        if (!last) {
            handleEndpointChange(field, value);
        }
    }

    return (
        <Container
            btn-count={Number((!!handleEndpointChange)) + Number((!!onDeleteClick))}
            not-new={last !== undefined}
            is-last={index === last}
        >
            <Dropdown
                id="endpoint-type"
                value={tempEndpoint.type}
                onValueChange={(text: string) => handleChanges("type", text)}
                items={endpointTypes}
            />
            {tempEndpoint.type === "static" ? (
                <Dropdown
                    id='endpoint-value'
                    value={tempEndpoint.value}
                    onValueChange={(text: string) => handleChanges("value", text)}
                    items={endpoints}
                    sx={{ marginTop: '-2px' }}
                />
            ) : (
                <CodeMirrorContainer>
                    <CodeMirror
                        value={tempEndpoint.value}
                        extensions={[xml(), linter(() => codemirrorErrors)]}
                        theme={oneDark}
                        onChange={(text: string) => handleChanges("value", text)}
                        maxHeight="200px"
                    />
                </CodeMirrorContainer>
            )}
            {handleEndpointChange && <Codicon
                iconSx={{ marginTop: 5, fontSize: 18 }}
                name='plus'
                onClick={() => handleSave !== undefined ? handleSave() : handleEndpointChange(index, tempEndpoint)}
                sx={{ opacity: (changesOccured || (index === undefined)) ? 1 : 0.2, cursor: (changesOccured || (index === undefined)) ? 'pointer' : 'not-allowed' }}
            />}
            {onDeleteClick && <Codicon iconSx={{ marginTop: 5, fontSize: 18 }} name='trash' onClick={() => onDeleteClick(index)} />}
        </Container>
    )
}

export default Endpoint;
