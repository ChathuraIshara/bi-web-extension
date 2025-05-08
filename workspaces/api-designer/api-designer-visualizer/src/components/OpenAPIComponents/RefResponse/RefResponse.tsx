/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import { Response as R } from '../../../Definitions/ServiceDefinitions';
import { PanelBody } from '../Parameters/Parameters';
import { Response } from '../Response/Response';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { useContext } from 'react';
import { PathID } from '../../../constants';

interface RefRequestBodyProps {
    responseName: string;
    response: R;
    onResponseChange: (response: R, name: string, initialName?: string) => void;
}

export function RefResponse(props: RefRequestBodyProps) {
    const { responseName, response, onResponseChange } = props;
    const { 
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);
    const handleResponseChangeChange = (response: R) => {
        onResponseChange(response, responseName, responseName);
    };
    const handleResponseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onResponseChange(response, e.target.value, responseName);
        onSelectedComponentIDChange(`${PathID.RESPONSE_COMPONENTS}${PathID.SEPERATOR}${e.target.value}`);
    };

    return (
        <PanelBody>
            <Typography sx={{ margin: 0, marginTop: 0, flex: 1 }} variant="h2">Response</Typography>
            <TextField
                label='Reference Name'
                placeholder='Enter the reference name'
                value={responseName}
                onBlur={(e) => handleResponseNameChange(e)}
            />
            <Response
                response={response}
                onResponseChange={handleResponseChangeChange}
            />
        </PanelBody>
    )
}
