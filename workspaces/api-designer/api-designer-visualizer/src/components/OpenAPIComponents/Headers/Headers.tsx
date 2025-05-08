/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, Codicon } from '@wso2-enterprise/ui-toolkit';
import { Headers as Hs, HeaderDefinition as H, ReferenceObject as R } from '../../../Definitions/ServiceDefinitions';
import SectionHeader from '../SectionHeader/SectionHeader';
import { Header } from '../Header/Header';
import { ReferenceObject } from '../ReferenceObject/ReferenceObject';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { RefComponent } from '../RefComponent/RefComponent';

interface HeadersProps {
    headers : Hs;
    title?: string;
    onHeadersChange: (headers: Hs) => void;
}

const isReferenceObject = (obj: H | R): obj is R => {
    return obj && typeof obj === 'object' && '$ref' in obj;
}

export function Headers(props: HeadersProps) {
    const { headers, title, onHeadersChange } = props;
    const { 
        props: { openAPI },
    } = useContext(APIDesignerContext);

    const componentParameterNames = openAPI?.components?.parameters ? Object.keys(openAPI?.components?.parameters) : [];
    const componentHeaderParamNames = componentParameterNames.filter((name) => openAPI?.components?.parameters[name].in === "header");

    const handleHeaderChange = (headers: Hs) => {
        onHeadersChange(headers);
    };

    const addNewReferenceObject = () => {
        const newHeader: R = {
            $ref: `#/components/parameters/${componentHeaderParamNames[0]}`,
            summary: "",
            description: ""
        };
        const headerName = headers ? `header${Object.keys(headers).length + 1}` : "header1";
        const modifiedHeaders = { ...headers, [headerName]: newHeader };
        handleHeaderChange(modifiedHeaders);
    };

    const addReferenceParamButton = () => {
        return (
            <RefComponent
                onChange={addNewReferenceObject}
                dropdownWidth={157} 
                componnetHeight={32}
            />
        );
    };

    const addNewHeader = () => {
        const newHeader: H = {
            schema: {
                type: "string"
            }
        };
        const headerName = headers ? `header${Object.keys(headers).length + 1}` : "header1";
        const modiefiedHeaders = { ...headers, [headerName]: newHeader };
        handleHeaderChange(modiefiedHeaders);
    };
    const getAddHeaderButton = () => (
        <Button appearance="icon" onClick={() => addNewHeader()}>
            <Codicon sx={{ marginRight: 5 }} name="add" />
            Add
        </Button>
    );

    const actionButtons = [
        getAddHeaderButton()
    ];
    if (componentHeaderParamNames.length > 0) {
        actionButtons.push(addReferenceParamButton());
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <SectionHeader title={title} actionButtons={actionButtons} />
            {headers && Object.entries(headers).map(([headerName, header], index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {isReferenceObject(header) ? (
                        <ReferenceObject
                            id={index}
                            type={"header"}
                            referenceObject={header as R}
                            onRefernceObjectChange={(referenceObject) => handleHeaderChange({ ...headers, [headerName]: referenceObject })}
                            onRemoveReferenceObject={(id) => {
                                const headersCopy = { ...headers };
                                delete headersCopy[headerName];
                                handleHeaderChange(headersCopy);
                            }}
                        />
                    ) : (
                        <Header
                            id={index}
                            header={header as H}
                            name={headerName}
                            onHeaderChange={(h) => handleHeaderChange({ ...headers, [headerName]: h })}
                            onRemoveHeader={(id) => {
                                const headersCopy = { ...headers };
                                delete headersCopy[headerName];
                                handleHeaderChange(headersCopy);
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
