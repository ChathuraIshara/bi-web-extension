/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, CheckBox, Codicon, Tabs, Typography, ViewItem } from '@wso2-enterprise/ui-toolkit';
import { Responses as Rs, Response as R, ReferenceObject as Ro } from '../../../Definitions/ServiceDefinitions';
import { useContext, useEffect, useState } from 'react';
import { Response } from '../Response/Response';
import { ReferenceObject } from '../ReferenceObject/ReferenceObject';
import SectionHeader from '../SectionHeader/SectionHeader';
import { useVisualizerContext } from '@wso2-enterprise/api-designer-rpc-client';
import { StatusCodes } from '../../../constants';
import { APIDesignerContext } from '../../../APIDesignerContext';

interface ResponsesProps {
    responses: Rs;
    referenceObjects?: string[];
    onResponsesChange: (contact: Rs) => void;
}

const isRefereceObject = (value: Rs | R): value is R => {
    return value.hasOwnProperty('$ref');
};

export function Responses(props: ResponsesProps) {
    const { responses, onResponsesChange } = props;
    const { rpcClient } = useVisualizerContext();
    const { 
        props: { openAPI },
    } = useContext(APIDesignerContext);
    const [selectedStatusCode, setSelectedStatusCode] = useState<string | undefined>(responses && Object.keys(responses)[0]);

    const statusCodes = responses && Object.keys(responses);
    const componentResponseNames = openAPI?.components?.responses ? Object.keys(openAPI?.components?.responses) : [];

    const handleResponsesChange = (responses: Rs) => {
        onResponsesChange(responses);
    };

    const hasReferenceObjects = openAPI?.components?.responses ? Object.keys(openAPI?.components?.responses).length > 0 : false;

    const statusTabViewItems: ViewItem[] = statusCodes && statusCodes.map(statusCode => ({ 
        id: statusCode,
        name: statusCode
    }));
    const statusCode: string[] = statusCodes && statusCodes?.map((status) => {
        const statusValue = StatusCodes[status as keyof typeof StatusCodes]; // Type assertion added here
        return `${status}: ${statusValue}`;
    });
    const statusCodeList: string[] = Object.entries(StatusCodes).map(([key, value]) => `${key}: ${value}`);

    const handleResponseChange = (response: R) => {
        const newResponses: Rs = {
            ...responses,
            [selectedStatusCode]: response
        };
        handleResponsesChange(newResponses);
    };

    const handleReferenceObjectChange = (referenceObject: Ro) => {
        const newResponses: Rs = {
            ...responses,
            [selectedStatusCode]: referenceObject
        };
        handleResponsesChange(newResponses);
    };

    const handleStatusCodeChange = (statusCodes: string[]) => {
        const valueRemovedStatusCodes = statusCodes.map((status) => status.split(":")[0]);
        const newResponses: Rs = valueRemovedStatusCodes.reduce((acc, item) => {
            acc[item] = responses ? (responses[item] || { description: "", content: {} } ) : { description: "", content: {} };
            return acc;
        }, {} as Rs);
        setSelectedStatusCode(statusCodes[0]);
        handleResponsesChange(newResponses);
    };

    const onConfigureResponsesClick = () => {
        rpcClient.selectQuickPickItems({
            title: "Select Responses",
            items: statusCodeList.map(item => ({ label: item, picked: statusCode?.includes(item) }))
        }).then(resp => {
            if (resp) {
                handleStatusCodeChange(resp.map(item => item.label))
            }
        })
    };

    const handleIsReferenceChange = (checked: boolean) => {
        const newResponses: Rs = {
            ...responses,
            [selectedStatusCode]: checked ? {
                $ref: `#/components/responses/${componentResponseNames[0]}`, summary: "", description: ""
            } :
                {
                    description: "", content: {}
                }
        };
        handleResponsesChange(newResponses);
    }

    useEffect(() => {
        if (statusCodes && !statusCodes.includes(selectedStatusCode)) {
            setSelectedStatusCode(statusCodes[0]);
        }
    }, [statusCodes]);

    return (
        <>
            <SectionHeader
                title="Responses"
                variant='h2'
                actionButtons={
                    <Button tooltip='Configure Responses' onClick={onConfigureResponsesClick} appearance='icon'>
                        <Codicon name='gear' sx={{ marginRight: "4px" }} /> Configure
                    </Button>
                }
            />
            {statusTabViewItems?.length > 0 ? (
                <Tabs views={statusTabViewItems} childrenSx={{paddingTop: 10}} currentViewId={selectedStatusCode} onViewChange={setSelectedStatusCode}>
                    {responses && Object.keys(responses)?.map((status) => (
                        <div id={status} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {hasReferenceObjects && (
                                <CheckBox
                                    label='Is Reference?'
                                    sx={{
                                        marginTop: 10,
                                        marginBottom: 0
                                    }}
                                    checked={isRefereceObject(responses[status])}
                                    onChange={(checked) => handleIsReferenceChange(checked)}
                                />
                            )}
                            {isRefereceObject(responses[status]) ? (
                                    <ReferenceObject
                                        id={0}
                                        type='response'
                                        referenceObject={responses[status] as Ro}
                                        onRefernceObjectChange={(referenceObject) => handleReferenceObjectChange(referenceObject)}
                                        onRemoveReferenceObject={() => {
                                            const responsesCopy = { ...responses };
                                            responsesCopy[status] = { description: "", content: {} };
                                            handleResponsesChange(responsesCopy);
                                        }}
                                    />
                            ) : (
                                <Response
                                    response={responses[status] as R}
                                    onResponseChange={(response) => handleResponseChange(response)}
                                />
                            )}
                        </div>
                    ))}
                </Tabs>
            ) : (<Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>No response statuses.</Typography>)}
        </>
    );
}
