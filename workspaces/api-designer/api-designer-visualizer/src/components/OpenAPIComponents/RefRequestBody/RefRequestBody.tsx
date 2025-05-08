/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import { RequestBody as R, ReferenceObject } from '../../../Definitions/ServiceDefinitions';
import { PanelBody } from '../Parameters/Parameters';
import { RequestBody } from '../RequestBody/RequestBody';
import { PathID } from '../../../constants';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';

interface RefRequestBodyProps {
    requestBodyName: string;
    requestBody: R | ReferenceObject;
    onRequestBodyChange: (requestBody: R | ReferenceObject, name: string, initialName?: string) => void;
}

export function RefRequestBody(props: RefRequestBodyProps) {
    const { requestBodyName, requestBody, onRequestBodyChange } = props;
    const { 
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);
    const handleRequestBodyChangeChange = (parameter: R | ReferenceObject) => {
        onRequestBodyChange(parameter, requestBodyName, requestBodyName);
    };
    const handleRequestBodyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onRequestBodyChange(requestBody, e.target.value, requestBodyName);
        onSelectedComponentIDChange(`${PathID.REQUEST_BODY_COMPONENTS}${PathID.SEPERATOR}${e.target.value}`);
    };

    return (
        <PanelBody>
            <Typography sx={{ margin: 0, marginTop: 0, flex: 1 }} variant="h2">Request Body</Typography>
            <TextField
                label='Reference Name'
                placeholder='Enter the reference name'
                value={requestBodyName}
                onBlur={(e) => handleRequestBodyNameChange(e)}
            />
            <RequestBody
                hideTitle
                requestBody={requestBody}
                onRequestBodyChange={handleRequestBodyChangeChange}
            />
        </PanelBody>
    )
}
