/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { OpenAPI as O } from '../../../Definitions/ServiceDefinitions';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { ReadOnlyPaths } from '../Paths/ReadOnlyPaths';
import { ReadOnlyOverview } from '../Overview/ReadOnlyOverview';
import { ReadOnlySchemaEditor } from '../../SchemaEditor/ReadOnlySchemaEditor';
import { ReadOnlyRefParameters } from '../RefParameter/ReadOnlyRefParameter';
import { ReadOnlyRefRequestBody } from '../RefRequestBody/ReadOnlyRefRequestBody';
import { ReadOnlyRefResponse } from '../RefResponse/ReadOnlyRefResponse';

interface OverviewProps {
    openAPI: O;
}

// Path parent component is represented with Paths#-Component#-path-method, 
// Overview is represented with Overview#-Component,
// Schema is represented with Schema#-Component#-schema
export function ReadOnlyOpenAPI(props: OverviewProps) {
    const { openAPI } = props;
    const { 
        props: { selectedComponentID },
    } = useContext(APIDesignerContext);
    const componetName = selectedComponentID.split("#-")[0];

    return (
        <>
            {componetName === "Overview" && (
                <ReadOnlyOverview openAPIDefinition={openAPI} />
            )}
            {componetName === "Paths" && (
                <ReadOnlyPaths 
                    paths={openAPI.paths} 
                />
            )}
            {componetName === "Schemas" && (
                <ReadOnlySchemaEditor
                    schema={openAPI.components.schemas[selectedComponentID.split("#-")[2]]}
                    schemaName={selectedComponentID.split("#-")[2]}
                />
            )}
            {componetName === "Parameters" && (
                <ReadOnlyRefParameters
                    parameter={openAPI.components.parameters[selectedComponentID.split("#-")[2]]}
                    name={selectedComponentID.split("#-")[2]}
                />
            )}
            {componetName === "RequestBody" && (
                <ReadOnlyRefRequestBody
                    requestBody={openAPI.components.requestBodies[selectedComponentID.split("#-")[2]]}
                    name={selectedComponentID.split("#-")[2]}
                />
            )}
            {componetName === "Responses" && (
                <ReadOnlyRefResponse
                    response={openAPI.components.responses[selectedComponentID.split("#-")[2]]}
                    name={selectedComponentID.split("#-")[2]}
                />
            )}
        </>
    )
}
