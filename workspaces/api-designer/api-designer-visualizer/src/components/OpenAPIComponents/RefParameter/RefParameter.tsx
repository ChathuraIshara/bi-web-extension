/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Dropdown, TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import { Parameter, SchemaTypes } from '../../../Definitions/ServiceDefinitions';
import { PanelBody } from '../Parameters/Parameters';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { PathID } from '../../../constants';

interface RefParamaterProps {
    paramerName: string;
    parameter: Parameter;
    onParameterChange: (parameter: Parameter, name: string, initialName?: string) => void;
}

const DataTypes = [
    "string",
    "number",
    "integer",
    "boolean",
    "array",
    "any"
];

export function RefParameter(props: RefParamaterProps) {
    const { paramerName, parameter, onParameterChange } = props;
    const { 
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);
    const handleParameterChange = (parameter: Parameter) => {
        onParameterChange(parameter, paramerName, paramerName);
    };
    const hanleParameterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onParameterChange(parameter, e.target.value, paramerName);
        onSelectedComponentIDChange(`${PathID.PARAMETERS_COMPONENTS}${PathID.SEPERATOR}${e.target.value}`);
    };

    const dataTypes = DataTypes.map((type) => {
        return { content: type, value: type };
    });

    return (
        <PanelBody>
            <Typography sx={{ margin: 0, marginTop: 0, flex: 1 }} variant="h2">Parameter</Typography>
            <TextField
                label='Reference Name'
                placeholder='Enter the reference name'
                value={paramerName}
                onBlur={(e) => hanleParameterNameChange(e)}
            />
            <Dropdown
                id='parameter-type'
                label='Parameter Type'
                items={[
                    { content: 'path', value: 'path' },
                    { content: 'query', value: 'query' },
                    { content: 'header', value: 'header' },
                ]}
                value={parameter.in}
                onChange={(e) => handleParameterChange(
                    {
                        ...parameter,
                        in: e.target.value as "header" | "path" | "query" | "cookie",
                    }
                )}
            />
            <TextField
                label='Parameter Name'
                placeholder='Enter the parameter name'
                value={parameter.name}
                onChange={(e) => handleParameterChange(
                    {
                        ...parameter,
                        name: e.target.value,
                    }
                )}
            />
            <Dropdown
                id={"parameter-data-type"}
                label={"Type"}
                items={dataTypes}
                value={parameter.schema?.type}
                onChange={(e) => handleParameterChange(
                    {
                        ...parameter,
                        schema: {
                            ...parameter.schema,
                            type: e.target.value as SchemaTypes,
                        }
                    }
                )}
            />
            <TextField
                label='Description'
                placeholder='Enter the description'
                value={parameter.description}
                onChange={(e) => handleParameterChange(
                    {
                        ...parameter,
                        description: e.target.value,
                    }
                )}
            />
        </PanelBody>
    )
}
