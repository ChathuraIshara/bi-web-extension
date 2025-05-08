/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useContext } from 'react';
import { MediaType as M } from '../../../Definitions/ServiceDefinitions';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { SchemaEditor } from '../../SchemaEditor/SchemaEditor';

interface MediaTypeProps {
    mediaType: M;
    onMediaTypeChange: (mediaType: M) => void;
}

export function MediaType(props: MediaTypeProps) {
    const { mediaType, onMediaTypeChange } = props;
    const { 
        props: { openAPI },
    } = useContext(APIDesignerContext);

    const handleSchemaChange = (contact: M) => {
        onMediaTypeChange(contact);
    };

    return (
        <>
            <SchemaEditor
                schema={mediaType?.schema}
                variant='h3'
                openAPI={openAPI} // Provide OpenAPI definition throught context
                schemaName={mediaType?.schema?.type as string}
                onSchemaChange={(schema) => handleSchemaChange({ ...mediaType, schema })}
            />
            {/* TODO: Add Support for examples and other fields */}
        </>
    )
}
