/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { Operation as O } from '../../../Definitions/ServiceDefinitions';
import { useVisualizerContext } from '@wso2-enterprise/api-designer-rpc-client';
import { getColorByMethod } from '../../Utils/OpenAPIUtils';
import { MarkdownRenderer } from '../Info/ReadOnlyInfo';
import { ReadOnlyParameters } from '../Parameters/ReadOnlyParameters';
import { ReadOnlyRequestBody } from '../RequestBody/ReadOnlyRequestBody';
import { ReadOnlyResponses } from '../Responses/ReadOnlyResponses';

export const PanelBody = styled.div`
    height: calc(100% - 87px);
    overflow-y: auto;
    padding: 16px;
    gap: 15px;
    display: flex;
    flex-direction: column;
`;
export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const SubSectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    gap: 5px;
`;
interface MethodWrapperProps {
    color: string;
}
const MethodWrapper = styled.div<MethodWrapperProps>`
    display: flex;
    width: fit-content;
    border-radius: 2px;
    color: white;
    background-color: ${(props: MethodWrapperProps) => props.color};
`;
const PathWrapper = styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 2px;
    gap: 10px;
    padding: 10px;
    width: fit-content;
    background-color: var(--vscode-quickInput-background);
`;

interface ReadOnlyOperationProps {
    operation: O;
    method: string;
    path: string;
}

export function ReadOnlyOperation(props: ReadOnlyOperationProps) {
    const { operation, method, path } = props;
    return (
        <PanelBody>
            <PathWrapper>
                <MethodWrapper color={getColorByMethod(method)}>
                    <Typography
                        variant="h3"
                        sx={{ margin: 0, padding: 4, display: "flex", justifyContent: "center", minWidth: 60 }}
                    >
                        {method.toUpperCase()}
                    </Typography>
                </MethodWrapper>
                <Typography sx={{ margin: 0, marginTop: 4 }} variant="h3">{path}</Typography>
            </PathWrapper>
            { operation.summary && (
                <>
                    <Typography sx={{ margin: 0 }} variant='h3'> Summary </Typography>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'> {operation.summary} </Typography>
                </>
            )}
            { operation.description && (
                <>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>
                        <MarkdownRenderer key="description" markdownContent={operation.description} />
                    </Typography>
                </>
            )}
            { operation.operationId && (
                <>
                    <Typography sx={{ margin: 0 }} variant='h3'> Operation ID </Typography>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'> {operation.operationId} </Typography>
                </>
            )}
            { operation.parameters && (
                <ReadOnlyParameters
                    parameters={operation.parameters}
                    title="Path Parameters"
                    type="path"
                />
            )}
            { operation.parameters && (
                <ReadOnlyParameters
                    parameters={operation.parameters}
                    title="Query Parameters"
                    type="query"
                />
            )}
            { operation.parameters && (
                <ReadOnlyParameters
                    parameters={operation.parameters}
                    title="Header Parameters"
                    type="header"
                />
            )}
            { operation.requestBody && method !== "get" && (
                <ReadOnlyRequestBody
                    requestBody={operation.requestBody}
                />
            )}
            { operation.responses && (
                <ReadOnlyResponses
                    responses={operation.responses}
                />
            )}
        </PanelBody>
    )
}
